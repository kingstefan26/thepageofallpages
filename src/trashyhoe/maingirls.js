document.addEventListener('DOMContentLoaded', () => {
    const game = document.getElementById('trashyhoe');
    const fps = document.getElementById('fps');
    const canv = document.getElementById('gamecanvas');
    const clearAll = document.getElementById('full-bg-clear');
    const ctx = canv.getContext('2d');


    const size = {w: 44, h: 70, frames: 8};


    const bg = new Image(600, 400);

    bg.onload = () => {
        const sprite = new Image;
        const w = bg.width, h = bg.height;
        canv.width = w;
        canv.height = h;
        game.style.width = w + "px";
        ctx.drawImage(bg, 0, 0);

        sprite.onload = () => {
            const padding = 200;
            const number = 400;

            // create spriteAmmout of sprites
            const sprites = new Array(number).fill(null).map(() => ({
                    x: Math.random() * (w - padding) + padding / 2,
                    y: Math.random() * (h - padding) + padding / 2,
                    f: Math.round(Math.random() * 3)
                })
            );


            let avgDelay = 0, lastDraw = performance.now();

            function drawFrame() {
                if (clearAll.checked) {
                    ctx.drawImage(bg, 0, 0);
                } else {
                    // Clear sprite locations
                    for (const sprite of sprites) {
                        ctx.drawImage(bg, sprite.x, sprite.y, size.w, size.h, sprite.x, sprite.y, size.w, size.h);
                    }
                }

                // Draw sprites
                for (const s of sprites) {
                    s.x += Math.random() * 4 - 2;
                    s.y += Math.random() * 4 - 2;
                    if (s.x + size.w >= w) s.x -= 10;
                    if (s.y + size.h >= h) s.y -= 10;

                    const offset = (s.f++ % size.frames) * size.w;


                    // const animationspeed = 3;
                    //
                    // s.x = 100;
                    // s.y = 100;
                    // s.c = s.c >= (animationspeed +1) ? 0 : s.c + 1;
                    // s.f = s.c === animationspeed ? s.f + 1 : s.f;
                    // const offset = (s.f % size.frames) * size.w;
                    ctx.drawImage(sprite, offset, 0, size.w, size.h, s.x, s.y, size.w, size.h);
                }

                const now = performance.now();
                const delay = now - lastDraw;
                avgDelay += (delay - avgDelay) / 10;
                lastDraw = now;
                setTimeout(drawFrame, 0);
            }
            drawFrame();
            setInterval(() => {
                fps.innerHTML = (1000 / avgDelay).toFixed(1) + " fps";
            }, 2000);

        };
        sprite.src = 'walking-girl2.png';
    };
    bg.src = 'me.jpg';
})
