import { useRef, useEffect } from 'react';

const COLS   = 16;
const ROWS   = 16;
const TW     = 42;
const TD     = 42;
const GAP    = 20;
const STRIDE = TW + GAP;

const CAM_Y   = 680;
const CAM_Z   = -160;
const FOV     = 500;
const HORIZON = 0.34;

/*
  Pre-sort far→near once (painter's algorithm without per-frame sort).
  Also bake the static world positions wx/wz — only h changes each frame.
*/
const TOWERS = Array.from({ length: COLS * ROWS }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    return {
        wx:    (col - (COLS - 1) * 0.5) * STRIDE,
        wz:    row * STRIDE + 70,
        minH:  10  + Math.random() * 50,
        maxH:  130 + Math.random() * 430,
        speed: 0.18 + Math.random() * 0.52,
        phase: Math.random() * Math.PI * 2,
    };
}).sort((a, b) => b.wz - a.wz);   // sorted once, never again

export default function TowerCanvas() {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        const ctx    = canvas.getContext('2d');
        let raf;
        let lastDraw = 0;
        let t0       = null;

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

        function frame(ts) {
            // 30 fps cap — background animation doesn't need 60
            if (ts - lastDraw < 34) {
                raf = requestAnimationFrame(frame);
                return;
            }
            lastDraw = ts;
            if (!t0) t0 = ts;
            const t = (ts - t0) * 0.001;

            const W = canvas.width;
            const H = canvas.height;
            ctx.clearRect(0, 0, W, H);

            for (let i = 0; i < TOWERS.length; i++) {
                const { wx, wz, minH, maxH, speed, phase } = TOWERS[i];
                const h = minH + (maxH - minH) * (0.5 + 0.5 * Math.sin(t * speed + phase));

                const fbl = proj(wx,      0, wz);
                const fbr = proj(wx + TW, 0, wz);
                if (!fbl || !fbr) continue;

                // Cull: skip towers too far (sub-pixel) or off-screen horizontally
                if (fbl.s < 0.055) continue;
                const ftl = proj(wx,      h, wz);
                const ftr = proj(wx + TW, h, wz);
                if (!ftl || !ftr) continue;
                if (ftr.x < 0 || ftl.x > W) continue;
                // Cull: both top corners below screen bottom
                if (ftl.y > H && ftr.y > H) continue;

                const btl = proj(wx,      h, wz + TD);
                const btr = proj(wx + TW, h, wz + TD);
                const bbr = proj(wx + TW, 0, wz + TD);

                const n        = Math.min(h / 380, 1);
                const isDistant = fbl.s < 0.28;

                // ── Front face ───────────────────────────────────────────
                ctx.beginPath();
                ctx.moveTo(ftl.x, ftl.y);
                ctx.lineTo(ftr.x, ftr.y);
                ctx.lineTo(fbr.x, fbr.y);
                ctx.lineTo(fbl.x, fbl.y);
                ctx.closePath();
                if (isDistant) {
                    ctx.fillStyle = `rgba(${90 + n*82},${16 + n*52},${192 + n*60},0.88)`;
                } else {
                    const g = ctx.createLinearGradient(fbl.x, fbl.y, ftl.x, ftl.y);
                    g.addColorStop(0,    'rgba(30, 0, 75, 0.92)');
                    g.addColorStop(0.45, `rgba(90,16,195,${0.87 + n*0.13})`);
                    g.addColorStop(1,    `rgba(${145+n*85},${34+n*68},255,${0.70+n*0.30})`);
                    ctx.fillStyle = g;
                }
                ctx.fill();

                // ── Right face (skip for distant towers) ─────────────────
                if (!isDistant && btr && bbr) {
                    ctx.beginPath();
                    ctx.moveTo(ftr.x, ftr.y);
                    ctx.lineTo(btr.x, btr.y);
                    ctx.lineTo(bbr.x, bbr.y);
                    ctx.lineTo(fbr.x, fbr.y);
                    ctx.closePath();
                    ctx.fillStyle = 'rgba(14, 0, 40, 0.97)';
                    ctx.fill();
                }

                // ── Top face ─────────────────────────────────────────────
                if (btl && btr) {
                    ctx.beginPath();
                    ctx.moveTo(ftl.x, ftl.y);
                    ctx.lineTo(ftr.x, ftr.y);
                    ctx.lineTo(btr.x, btr.y);
                    ctx.lineTo(btl.x, btl.y);
                    ctx.closePath();
                    if (isDistant) {
                        ctx.fillStyle = `rgba(${160+n*80},${60+n*80},255,${0.32+n*0.40})`;
                    } else {
                        const g = ctx.createLinearGradient(ftl.x, ftl.y, btl.x, btl.y);
                        g.addColorStop(0, `rgba(${172+n*83},${68+n*92},255,${0.50+n*0.50})`);
                        g.addColorStop(1, `rgba(105,28,205,${0.25+n*0.45})`);
                        ctx.fillStyle = g;
                    }
                    ctx.fill();
                }
            }

            // ── Depth fog ────────────────────────────────────────────────
            {
                const g = ctx.createLinearGradient(0, 0, 0, H);
                g.addColorStop(0,    'rgba(8,0,24,0.97)');
                g.addColorStop(0.36, 'rgba(8,0,24,0.52)');
                g.addColorStop(0.50, 'rgba(8,0,24,0.04)');
                g.addColorStop(0.82, 'rgba(8,0,24,0.00)');
                g.addColorStop(1,    'rgba(8,0,24,0.50)');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, W, H);
            }

            // ── Vignette ─────────────────────────────────────────────────
            {
                const r = Math.max(W, H) * 0.74;
                const g = ctx.createRadialGradient(W/2, H/2, r*0.20, W/2, H/2, r);
                g.addColorStop(0, 'rgba(0,0,0,0)');
                g.addColorStop(1, 'rgba(4,0,14,0.78)');
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
            style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', display: 'block' }}
        />
    );
}
