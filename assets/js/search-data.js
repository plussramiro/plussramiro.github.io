// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "Publications",
          description: "Publications (peer-reviewed and preprints) in computational neuroscience, connectomics, and bioinspired robotics.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "Research and development projects across computational neuroscience, connectomics, and embodied robotics.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-repositories",
          title: "Repositories",
          description: "Selected GitHub repositories and research code.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Online CV with section anchors, plus PDF download.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-teaching",
          title: "Teaching",
          description: "Teaching activities and course support in bioinspired robotics.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "nav-bioinspired-robotics-laboratory",
          title: "Bioinspired Robotics Laboratory",
          description: "Computational neuroscience, connectomics, complex systems, and bioinspired robotics.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/people/";
          },
        },{id: "projects-adaptive-networks-with-chaotic-units",
          title: 'Adaptive Networks with Chaotic Units',
          description: "Studying how connection density shapes synchronization, integration, and modular organization in adaptive dynamical networks.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/adaptive-chaotic-networks/";
            },},{id: "projects-connectome-driven-embodied-robotics",
          title: 'Connectome-Driven Embodied Robotics',
          description: "Building robotic control architectures from biological connectomes to study autonomy, proprioception, and sensorimotor feedback.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/connectome-driven-robotics/";
            },},{id: "projects-drosophila-leg-and-wing-motor-connectomics",
          title: 'Drosophila Leg and Wing Motor Connectomics',
          description: "Connectomics of Drosophila leg and wing motor circuits, including identified motor neurons, front-leg muscles, and the premotor-motor connectivity matrix.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/drosophila-leg-wing-motor-connectomics/";
            },},{id: "projects-animatronic-head-torso",
          title: 'Animatronic Head + Torso',
          description: "Eyes, neck, shoulders, and elbows integrated into a PS2-controlled animatronic prototype.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/robotics-animatronic-head-torso/";
            },},{id: "projects-dual-eye-saccades-and-blink",
          title: 'Dual-Eye Saccades and Blink',
          description: "Eye actuation prototype for saccadic motion and coordinated blinking.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/robotics-dual-eye-saccades/";
            },},{id: "projects-hexapod-robot-gaits-18-dof",
          title: 'Hexapod Robot Gaits (18-DoF)',
          description: "Tripod, ripple, and wave gait experiments on an 18-servo hexapod platform.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/robotics-hexapod-gaits/";
            },},{id: "projects-hexapod-joystick-control-natural-motions",
          title: 'Hexapod Joystick Control - Natural Motions',
          description: "Silent demo of joystick-controlled hexapod locomotion with natural motion primitives.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/robotics-hexapod-natural-motions/";
            },},{id: "projects-mecanum-omni-directional-robot",
          title: 'Mecanum Omni-Directional Robot',
          description: "Mecanum-wheel mobile base with PS2 joystick control and ultrasonic sensing.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/robotics-mecanum-omni/";
            },},{id: "projects-single-leg-servo-calibration",
          title: 'Single Leg Servo Calibration',
          description: "Offset tuning and motion calibration for early hexapod leg control.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/robotics-single-leg-calibration/";
            },},{id: "projects-strandbeest-style-walker",
          title: 'Strandbeest-Style Walker',
          description: "Theo Jansen-inspired walking mechanism prototype driven by continuous-rotation servos.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/robotics-strandbeest-walker/";
            },},{id: "projects-two-wheel-obstacle-avoidance",
          title: 'Two-Wheel Obstacle Avoidance',
          description: "Braitenberg-inspired controller using ultrasonic and light sensing.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/robotics-two-wheel-obstacle-avoidance/";
            },},{id: "projects-hemispheric-specific-wilson-cowan-model",
          title: 'Hemispheric-Specific Wilson-Cowan Model',
          description: "Modeling resting-state functional connectivity with asymmetric intra- and inter-hemispheric coupling.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/wilson-cowan-hemispheric/";
            },},{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/Pluss_Ramiro_CV.pdf", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%72%70%6C%75%73%73@%69%74%62%61.%65%64%75.%61%72", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/ramiropluss", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/plussramiro", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=l1XV7YYAAAAJ", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0009-0000-6502-0668", "_blank");
        },
      },{
        id: 'social-researchgate',
        title: 'ResearchGate',
        section: 'Socials',
        handler: () => {
          window.open("https://www.researchgate.net/profile/Ramiro-Pluess/", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
