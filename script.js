document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('systemCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    const config = {
        particleCount: 120,
        connectionDistance: 150,
        mouseRadius: 200,
        baseColor: 'rgba(255, 255, 255, 0.1)',
        accentColor: 'rgba(242, 255, 0, 0.6)'
    };

    let mouse = { x: null, y: null };

    function init() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 1.5 + 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < config.mouseRadius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (config.mouseRadius - distance) / config.mouseRadius;
                    this.x -= forceDirectionX * force * 2;
                    this.y -= forceDirectionY * force * 2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = config.baseColor;
            ctx.fill();
        }
    }

    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance) {
                    let opacity = 1 - (distance / config.connectionDistance);
                    let mouseDist = 9999;
                    
                    if (mouse.x != null) {
                        let mdx = mouse.x - particles[a].x;
                        let mdy = mouse.y - particles[a].y;
                        mouseDist = Math.sqrt(mdx * mdx + mdy * mdy);
                    }

                    if (mouseDist < config.mouseRadius) {
                        ctx.strokeStyle = `rgba(242, 255, 0, ${opacity * 0.8})`;
                    } else {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.1})`;
                    }
                    
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        connect();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    init();
    animate();
});
