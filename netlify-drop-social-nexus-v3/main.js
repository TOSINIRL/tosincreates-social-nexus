(function() {
    // 0. Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const themeDot = document.querySelector('.theme-dot');
    // Use one balanced profile site-wide: keep motion, trim the expensive effects.
    body.classList.add('performance-mode');
    localStorage.removeItem('performance_mode_override');

    const isPerformanceMode = true;

    const initMediaOptimizations = () => {
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (!img.hasAttribute('loading')) img.setAttribute('loading', index < 2 ? 'eager' : 'lazy');
            if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
            if (!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', index === 0 ? 'high' : 'low');
        });

        const iframes = document.querySelectorAll('iframe');
        iframes.forEach((iframe) => {
            if (!iframe.hasAttribute('loading')) iframe.setAttribute('loading', 'lazy');
        });
    };

    initMediaOptimizations();

    // Keep clocks alive independently from the rest of the animation stack.
    const startSystemClock = () => {
        const clockFormatters = {
            YYZ: new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/Toronto',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }),
            LDN: new Intl.DateTimeFormat('en-US', {
                timeZone: 'Europe/London',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }),
            TKY: new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Tokyo',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            })
        };

        const tick = () => {
            const now = new Date();
            const yyzTime = clockFormatters.YYZ.format(now);

            const headerClock = document.getElementById('headerTime');
            const heroClock = document.getElementById('heroClock');
            const yyzClock = document.getElementById('clockYYZ');
            const ldnClock = document.getElementById('clockLDN');
            const tkyClock = document.getElementById('clockTKY');

            if (headerClock) headerClock.textContent = yyzTime;
            if (heroClock) heroClock.textContent = yyzTime;
            if (yyzClock) yyzClock.textContent = yyzTime;
            if (ldnClock) ldnClock.textContent = clockFormatters.LDN.format(now);
            if (tkyClock) tkyClock.textContent = clockFormatters.TKY.format(now);
        };

        tick();
        window.setInterval(tick, 1000);
    };

    startSystemClock();

    // Robust Initialization
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            body.classList.add('light-theme');
            if (themeToggle) {
                themeToggle.classList.remove('dark-active');
                gsap.set(themeDot, { x: 0 });
            }
        } else {
            body.classList.remove('light-theme');
            if (themeToggle) {
                themeToggle.classList.add('dark-active');
                gsap.set(themeDot, { x: 22 });
            }
        }
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = body.classList.toggle('light-theme');
            const theme = isLight ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
            
            // UI Sync
            themeToggle.classList.toggle('dark-active', !isLight);
            gsap.to(themeDot, { 
                x: isLight ? 0 : 22, 
                duration: 0.4, 
                ease: "back.out(1.7)" 
            });
        });
        
        // Initial setup
        initTheme();
    }

    // 0.1 Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';

            // Animation for links
            if (isOpen) {
                gsap.from('.mobile-nav-links li', {
                    y: 30,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.5,
                    ease: "power2.out",
                    delay: 0.2
                });
            }
        });

        // Close menu when link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }




    // 0. Mob Psycho Preloader & Site Reveal (Restored)
    const initPreloader = () => {
        const loadCount = document.getElementById('load-count');
        const preloader = document.getElementById('preloader');
        
        if (!preloader) return;

        if (isPerformanceMode) {
            preloader.style.display = 'none';
            preloader.style.zIndex = '-1';
            document.body.classList.remove('js-loading');
            gsap.set(['header', 'main'], { opacity: 1, visibility: 'visible', pointerEvents: 'all' });
            initEffects();
            initViewToggle();
            initEcosystem();
            ScrollTrigger.refresh();
            return;
        }

        // Force preloader every time for verification (removed sessionStorage check)
        
        document.body.classList.add('js-loading');
        const tl = gsap.timeline();
        let progressVal = { value: 0 };

        // Animate counter
        tl.to(progressVal, {
            value: 100,
            duration: 3,
            ease: "power2.inOut",
            onUpdate: () => {
                const rounded = Math.floor(progressVal.value);
                if (loadCount) {
                    loadCount.textContent = rounded;
                    // Mob Intensity Transitions
                    if (rounded >= 90) preloader.classList.add('mob-intensity-high');
                    if (rounded >= 99) loadCount.classList.add('glitch');
                }
            }
        })
        .to('.shigeo-aura', {
            opacity: 1,
            duration: 1.5,
            ease: "power2.in"
        }, "-=1.5")
        // Pause for impact at 100%
        .to({}, { duration: 0.8 }) 
        // Dismiss Preloader
        .to(preloader, {
            clipPath: 'circle(0% at 50% 50%)',
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
                preloader.style.display = 'none';
                preloader.style.zIndex = '-1'; 
                document.body.classList.remove('js-loading');
                sessionStorage.setItem('preloader_shown', 'true');
                gsap.set(['header', 'main'], { opacity: 1, visibility: 'visible', pointerEvents: 'all' });
                
                // Initialize interactions after site is visible
                initEffects();
                initViewToggle();
                initEcosystem();
                ScrollTrigger.refresh();
            }
        })
        // Reveal site content
        .to(['header', 'main'], {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out"
        }, "-=0.5")
        .to('.watermark-text', {
            opacity: 0.03,
            y: 0,
            duration: 1.5,
            stagger: 0.3
        }, "-=1");
    };

    // Initialize Preloader
    initPreloader();

    const players = {};
    const videoData = [
        { id: 'monkey-player', videoId: 'UNarPhkqDD0', cardClass: '.featured-monkey', title: 'HOW TO RIZZ UP EVERY BADDIE 😈 (MONKEY APP)' },
        { id: 'shangchi-player', videoId: '1UVkZgmm4Gk', cardClass: '.featured-shangchi', title: 'WHEN SHANG CHI WAS PUTTING BTA ON HIS POPS' }
    ];

    const hasVideoCards = () => videoData.some(data => document.querySelector(data.cardClass));

    const loadYouTubeAPI = () => {
        if (window.__ytApiRequested) return;
        window.__ytApiRequested = true;

        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    };

    window.onYouTubeIframeAPIReady = () => {
        if (!hasVideoCards()) return;
        videoData.forEach(data => setupVideo(data));
    };

    if (hasVideoCards() && !isPerformanceMode) {
        const videoSection = document.querySelector('.youtube-hub') || document.querySelector('#community') || document.querySelector('.work');
        if ('IntersectionObserver' in window && videoSection) {
            const ytObserver = new IntersectionObserver((entries, observer) => {
                if (entries.some(entry => entry.isIntersecting)) {
                    loadYouTubeAPI();
                    observer.disconnect();
                }
            }, { rootMargin: '250px 0px' });
            ytObserver.observe(videoSection);
        } else {
            loadYouTubeAPI();
        }
    }

    // 2. Social Stats Logic (Removed)
    const initSocialStats = () => {
        // Stats removed as requested
    };

    function setupVideo(data) {
        const card = document.querySelector(data.cardClass);
        if (!card) return;

        const img = card.querySelector('.thumbnail-img');
        const title = card.querySelector('.video-title');
        const volBtn = card.querySelector('.volume-control');
        const dot = volBtn.querySelector('.dot');
        
        if (title) title.innerText = data.title;
        if (img) img.src = `https://i.ytimg.com/vi/${data.videoId}/hqdefault.jpg`;

        // Initialize Player
        players[data.id] = new YT.Player(data.id, {
            height: '100%',
            width: '100%',
            videoId: data.videoId,
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'modestbranding': 1,
                'rel': 0,
                'showinfo': 0,
                'loop': 1,
                'playlist': data.videoId,
                'playsinline': 1,
                'mute': 1,
                'enablejsapi': 1
            },
            events: {
                'onReady': (event) => { event.target.mute(); },
                'onStateChange': (event) => {
                    if (event.data === YT.PlayerState.PLAYING) {
                        gsap.to(event.target.getIframe(), { opacity: 1, duration: 0.4 });
                        gsap.to(img, { opacity: 0, duration: 0.4 });
                    }
                }
            }
        });

        // Volume Toggle Sync
        let audioOn = localStorage.getItem('audio_preview') === 'true';
        if (audioOn) {
            volBtn.classList.add('on');
            gsap.set(dot, { x: 22 });
        }

        volBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            audioOn = !audioOn;
            localStorage.setItem('audio_preview', audioOn);
            volBtn.classList.toggle('on', audioOn);
            gsap.to(dot, { x: audioOn ? 22 : 0, duration: 0.4, ease: "back.out" });

            if (players[data.id]) {
                if (audioOn) players[data.id].unMute();
                else players[data.id].mute();
            }
        });

        // Hover Logic
        card.addEventListener('mouseenter', () => {
            const player = players[data.id];
            if (player && player.playVideo) {
                if (localStorage.getItem('audio_preview') === 'true') player.unMute();
                else player.mute();
                player.playVideo();
            }
            gsap.to(card, { scale: 1.02, duration: 0.4, ease: "power2.out" });
        });

        card.addEventListener('mouseleave', () => {
            const player = players[data.id];
            if (player && player.pauseVideo) player.pauseVideo();
            gsap.to(card.querySelector('iframe'), { opacity: 0, duration: 0.2 });
            gsap.to(img, { opacity: 1, duration: 0.2 });
            gsap.to(card, { scale: 1, duration: 0.4 });
        });
    }

    // 3. SLEEK REVEAL EFFECTS
    const initEffects = () => {
        initSocialStats();

        // 3.1 About Section: Sophisticated Reveal
        const aboutTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.about',
                start: 'top 75%',
                toggleActions: "play none none none"
            }
        });

        // Split text reveal simulation (using clip-path)
        aboutTl.from('.about-heading', {
            clipPath: 'inset(0 100% 0 0)',
            x: -30,
            duration: 1.2,
            ease: "expo.out"
        })
        .from('.about-para', {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: "power3.out"
        }, "-=0.8")
        .from('.system-card', {
            opacity: 0,
            y: 40,
            scale: 0.98,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.2)"
        }, "-=0.6");

        // 3.2 Project Grid: Premium Staggered Entry (Removed to prevent scroll lag)

        // 3.3 Hero Watermark Parallax (Enhanced)
        if (!isPerformanceMode) {
            gsap.to('.hero-watermark', {
                y: 150,
                opacity: 0,
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }

        // 3.4 Tech Marquee Sync
        // In performance mode, let CSS handle marquee to avoid duplicate continuous animation work.
        if (!isPerformanceMode) {
            gsap.to('.marquee-content', {
                xPercent: -50,
                repeat: -1,
                duration: 20,
                ease: "none"
            });
        }

        // Ensure everything is calculated correctly
        ScrollTrigger.refresh();
    };

    // 3. Grid / List View Toggle Logic
    const initViewToggle = () => {
        const gridViewBtn = document.getElementById('gridViewBtn');
        const listViewBtn = document.getElementById('listViewBtn');
        const projectGrid = document.querySelector('.project-grid');
        const projectCards = gsap.utils.toArray('.project-card');

        if (!gridViewBtn || !listViewBtn || !projectGrid) return;

        const setView = (view) => {
            const isList = view === 'list';
            if (projectGrid.classList.contains('list-view') === isList) return;
            
            // UI Sync
            gridViewBtn.classList.toggle('active', !isList);
            listViewBtn.classList.toggle('active', isList);

            // High-Performance Animation
            const tl = gsap.timeline();

            tl.to(projectCards, {
                opacity: 0,
                scale: 0.95,
                duration: 0.2,
                stagger: 0.02,
                ease: "power2.in",
                force3D: true // Force GPU acceleration
            })
            .call(() => {
                projectGrid.classList.toggle('list-view', isList);
            })
            .to(projectCards, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                stagger: 0.03,
                ease: "back.out(1.2)",
                force3D: true
            });

            localStorage.setItem('project_view', view);
        };

        gridViewBtn.addEventListener('click', () => setView('grid'));
        listViewBtn.addEventListener('click', () => setView('list'));

        // Initialize from storage
        const savedView = localStorage.getItem('project_view');
        if (savedView === 'list') {
            projectGrid.classList.add('list-view');
            gridViewBtn.classList.remove('active');
            listViewBtn.classList.add('active');
        }
    };

    // 4. ECOSYSTEM FEATURES
    const initEcosystem = () => {
        // Agentic Log Simulator
        const logContainer = document.getElementById('agenticLog');
        const logs = [
            'Analyzing viewport dynamics...',
            'Optimizing luxury delivery paths...',
            'Agent Tosin: Status Nominal.',
            'Executing logic-driven design...',
            'Syncing with AI ecosystem...',
            'Bespoke experience initiated.',
            'Neutralizing UI friction points...',
            'Aura synchronization: 100%',
            'Mastering agentic architecture...'
        ];

        let logIndex = 0;
        const addLog = () => {
            if (!logContainer) return;
            const line = document.createElement('div');
            line.className = 'log-line';
            line.innerHTML = `> ${logs[logIndex]}`;
            logContainer.appendChild(line);
            
            // Auto-scroll and maintain count
            if (logContainer.children.length > 5) {
                logContainer.removeChild(logContainer.firstChild);
            }
            
            logIndex = (logIndex + 1) % logs.length;
            const nextDelay = isPerformanceMode ? 4500 : Math.random() * 2000 + 1500;
            setTimeout(addLog, nextDelay);
        };
        addLog();



        // Magnetic Social Buttons removed as requested


    };

    // 0. Status Dot Pulsing
    if (!isPerformanceMode && document.querySelector('.status-dot')) {
        gsap.to('.status-dot', {
            opacity: 0.2,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });
    }


    // 6. Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    // Ensure GSAP plugins are ready
})();
