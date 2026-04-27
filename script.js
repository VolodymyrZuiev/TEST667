document.addEventListener('DOMContentLoaded', () => {
    // 1. Cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top = my + 'px';
    });

    const moveFollower = () => {
        fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
        follower.style.left = fx + 'px'; follower.style.top = fy + 'px';
        requestAnimationFrame(moveFollower);
    };
    moveFollower();

    // Logo click to top
    document.getElementById('logoToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 2. Magnetic
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width/2) * 0.3;
            const y = (e.clientY - r.top - r.height/2) * 0.3;
            el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            follower.style.background = 'rgba(242, 255, 0, 0.15)';
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate3d(0,0,0)`;
            follower.style.background = 'none';
        });
    });

    // 3. Reveal Animation
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 4. Background (Nodes) - Brighter
    const mainCanvas = document.getElementById('mainCanvas');
    const mCtx = mainCanvas.getContext('2d');
    let W, H, particles = [];

    const initMainBG = () => {
        W = mainCanvas.width = window.innerWidth;
        H = mainCanvas.height = window.innerHeight;
        particles = Array.from({length: 80}, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35
        }));
    };

    const drawMainBG = () => {
        mCtx.clearRect(0,0,W,H);
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if(p.x<0 || p.x>W) p.vx*=-1; if(p.y<0 || p.y>H) p.vy*=-1;
            mCtx.fillStyle = 'rgba(255,255,255,0.4)';
            mCtx.beginPath(); mCtx.arc(p.x, p.y, 1, 0, Math.PI*2); mCtx.fill();
            for(let j=i+1; j<particles.length; j++) {
                let p2 = particles[j];
                let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                if(dist < 180) {
                    mCtx.strokeStyle = `rgba(255,255,255,${0.2 * (1 - dist/180)})`;
                    mCtx.beginPath(); mCtx.moveTo(p.x, p.y); mCtx.lineTo(p2.x, p2.y); mCtx.stroke();
                }
            }
        });
        requestAnimationFrame(drawMainBG);
    };
    initMainBG(); drawMainBG();
    window.addEventListener('resize', initMainBG);

    // 5. Card Animations (0.25x Speed)
    const initViz = (id, drawFn) => {
        const c = document.getElementById(id);
        const ctx = c.getContext('2d');
        const loop = () => {
            c.width = c.offsetWidth; c.height = c.offsetHeight;
            drawFn(ctx, c.width, c.height);
            requestAnimationFrame(loop);
        };
        loop();
    };

    let time = 0;
    initViz('canvas-delivery', (ctx, w, h) => {
        time += 0.0125;
        ctx.strokeStyle = '#f2ff00';
        ctx.beginPath(); ctx.arc(w/2, h/2, 45 + Math.sin(time)*10, 0, Math.PI*2); ctx.stroke();
    });
    initViz('canvas-ideas', (ctx, w, h) => {
        time += 0.005;
        ctx.strokeStyle = 'white';
        ctx.save(); ctx.translate(w/2, h/2); ctx.rotate(time);
        ctx.strokeRect(-35, -35, 70, 70); ctx.restore();
    });
    initViz('canvas-validation', (ctx, w, h) => {
        time += 0.0075;
        ctx.strokeStyle = '#f2ff00';
        ctx.beginPath(); ctx.arc(w/2, h/2, 60, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w/2, h/2);
        ctx.lineTo(w/2 + Math.cos(time)*65, h/2 + Math.sin(time)*65); ctx.stroke();
    });

    // 6. Form Logic
    const nameInput = document.getElementById('nameInput');
    const extraFields = document.getElementById('extraFields');
    nameInput.addEventListener('input', () => { if(nameInput.value.length > 1) extraFields.classList.add('visible'); });
    document.getElementById('mainForm').addEventListener('submit', e => {
        e.preventDefault(); e.target.style.display = 'none';
        document.getElementById('successMsg').style.display = 'block';
    });
});