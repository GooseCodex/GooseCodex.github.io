import { useRef, useEffect } from 'react';

const COLS   = 24;
const ROWS   = 22;
const TW     = 42;   // tower width  (x-axis world units)
const TD     = 42;   // tower depth  (z-axis world units)
const GAP    = 18;   // gap between towers
const STRIDE = TW + GAP;

// Stable random data generated once at module load
const SEED = Array.from({ length: COLS * ROWS }, (_, i) => ({
    col:   i % COLS,
    row:   Math.floor(i / COLS),
    minH:  10 + Math.random() * 50,
    maxH:  130 + Math.random() * 430,
    speed: 0.18 + Math.random() * 0.52,
    phase: Math.random() * Math.PI * 2,
}));

// Camera + projection constants
const CAM_Y   = 680;   // raised higher for steeper top-down angle
const CAM_Z   = -160;  // pulled back to widen the visible field
const FOV     = 500;   // focal length
const HORIZON = 0.34;  // horizon higher on screen (more sky visible = more diagonal feel)

export default function TowerCanvas() {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        const ctx    = canvas.getContext('2d');
        let raf;

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        function proj(x, y, z) {
            const dz = z - CAM_Z;
            if (dz < 1) return null;
            const s = FOV / dz;
            return {
                x: canvas.width  * 0.5 + x * s,
                y: canvas.height * HORIZON + (CAM_Y - y) * s,
                s,
            };
        }

        let t0 = null;

        function frame(ts) {
            if (!t0) t0 = ts;
            const t  = (ts - t0) * 0.001;
            const W  = canvas.width;
            const H  = canvas.height;

            ctx.clearRect(0, 0, W, H);

            // Compute current heights and sort far → near (painter's algorithm)
            const towers = SEED.map(d => {
                const wx = (d.col - (COLS - 1) * 0.5) * STRIDE;
                const wz = d.row * STRIDE + 70;
                const h  = d.minH + (d.maxH - d.minH) *
                           (0.5 + 0.5 * Math.sin(t * d.speed + d.phase));
                return { wx, wz, h };
            }).sort((a, b) => b.wz - a.wz);

            towers.forEach(({ wx, wz, h }) => {
                const ftl = proj(wx,      h,  wz);
                const ftr = proj(wx + TW, h,  wz);
                const fbl = proj(wx,      0,  wz);
                const fbr = proj(wx + TW, 0,  wz);
                const btl = proj(wx,      h,  wz + TD);
                const btr = proj(wx + TW, h,  wz + TD);
                const bbl = proj(wx,      0,  wz + TD);
                const bbr = proj(wx + TW, 0,  wz + TD);

                if (!fbl || !fbr || !ftl || !ftr) return;

                // Brightness 0..1 based on tower height (taller = brighter)
                const n = Math.min(h / 380, 1);

                // ── Front face ───────────────────────────────────────────
                {
                    const g = ctx.createLinearGradient(fbl.x, fbl.y, ftl.x, ftl.y);
                    g.addColorStop(0,    'rgba(30,  0, 75, 0.92)');
                    g.addColorStop(0.45, `rgba(90, 16, 195, ${0.87 + n * 0.13})`);
                    g.addColorStop(1,    `rgba(${145 + n * 85}, ${34 + n * 68}, 255, ${0.70 + n * 0.30})`);
                    ctx.beginPath();
                    ctx.moveTo(ftl.x, ftl.y);
                    ctx.lineTo(ftr.x, ftr.y);
                    ctx.lineTo(fbr.x, fbr.y);
                    ctx.lineTo(fbl.x, fbl.y);
                    ctx.closePath();
                    ctx.fillStyle = g;
                    ctx.fill();
                }

                // ── Right side face (darker — in shadow) ─────────────────
                if (btr && bbr) {
                    const g = ctx.createLinearGradient(fbr.x, fbr.y, bbr.x, bbr.y);
                    g.addColorStop(0, 'rgba(16,  0, 45, 0.96)');
                    g.addColorStop(1, 'rgba( 7,  0, 28, 0.98)');
                    ctx.beginPath();
                    ctx.moveTo(ftr.x, ftr.y);
                    ctx.lineTo(btr.x, btr.y);
                    ctx.lineTo(bbr.x, bbr.y);
                    ctx.lineTo(fbr.x, fbr.y);
                    ctx.closePath();
                    ctx.fillStyle = g;
                    ctx.fill();
                }

                // ── Top face (brightest — directly lit) ──────────────────
                if (btl && btr) {
                    const g = ctx.createLinearGradient(ftl.x, ftl.y, btl.x, btl.y);
                    g.addColorStop(0, `rgba(${172 + n * 83}, ${68 + n * 92}, 255, ${0.50 + n * 0.50})`);
                    g.addColorStop(1, `rgba(105, 28, 205, ${0.25 + n * 0.45})`);
                    ctx.beginPath();
                    ctx.moveTo(ftl.x, ftl.y);
                    ctx.lineTo(ftr.x, ftr.y);
                    ctx.lineTo(btr.x, btr.y);
                    ctx.lineTo(btl.x, btl.y);
                    ctx.closePath();
                    ctx.fillStyle = g;
                    ctx.fill();
                }
            });

            // ── Depth fog — darkens sky and far distance ──────────────
            {
                const g = ctx.createLinearGradient(0, 0, 0, H);
                g.addColorStop(0,    'rgba(8, 0, 24, 0.97)');
                g.addColorStop(0.36, 'rgba(8, 0, 24, 0.52)');
                g.addColorStop(0.50, 'rgba(8, 0, 24, 0.04)');
                g.addColorStop(0.82, 'rgba(8, 0, 24, 0.00)');
                g.addColorStop(1,    'rgba(8, 0, 24, 0.50)');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, W, H);
            }

            // ── Radial vignette ───────────────────────────────────────
            {
                const r = Math.max(W, H) * 0.74;
                const g = ctx.createRadialGradient(W / 2, H / 2, r * 0.20, W / 2, H / 2, r);
                g.addColorStop(0, 'rgba(0, 0, 0, 0)');
                g.addColorStop(1, 'rgba(4, 0, 14, 0.78)');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, W, H);
            }

            raf = requestAnimationFrame(frame);
        }

        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={ref}
            style={{
                position:      'fixed',
                inset:         0,
                zIndex:        0,
                pointerEvents: 'none',
                display:       'block',
            }}
        />
    );
}
