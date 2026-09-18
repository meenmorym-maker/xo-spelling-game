/* ========================================================
       1. AUTO-RESIZING & LETTERBOX ENGINE FOR 1920x1080 STAGE
       ======================================================== */
    const STAGE_WIDTH = 1920;
    const STAGE_HEIGHT = 1080;
    const stage = document.getElementById('presentation-stage');

    function resizeStage() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Scale proportionally to preserve 16:9 ratio
      const scaleX = windowWidth / STAGE_WIDTH;
      const scaleY = windowHeight / STAGE_HEIGHT;
      const scale = Math.min(scaleX, scaleY);

      stage.style.transform = `scale(${scale})`;
    }

    window.addEventListener('resize', resizeStage);
    window.addEventListener('DOMContentLoaded', resizeStage);

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }

    /* ========================================================
       2. WEB AUDIO SYNTHESIZER
       ======================================================== */
    let audioCtx = null;
    let isMuted = false;

    function initAudio() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
    }

    function playTone(freq, type = 'sine', duration = 0.12, gainVal = 0.15) {
      if (isMuted) return;
      try {
        initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {
        console.warn(e);
      }
    }

    function playFlipSound() {
      playTone(480, 'sine', 0.08, 0.12);
      setTimeout(() => playTone(640, 'triangle', 0.1, 0.1), 30);
    }

    function playSuccessSound() {
      playTone(523, 'triangle', 0.1, 0.2);
      setTimeout(() => playTone(659, 'triangle', 0.12, 0.2), 80);
      setTimeout(() => playTone(784, 'triangle', 0.22, 0.2), 160);
    }

    function toggleMute() {
      isMuted = !isMuted;
      document.getElementById('sound-toggle').textContent = isMuted ? '🔇 ปิดเสียง' : '🔊 มีเสียง';
    }

    /* ========================================================
       3. 3 QUESTION SETS DATA STRUCTURE
       ======================================================== */
    const DEFAULT_BASE_CARDS = [
    {
        "id": 0,
        "name": "ต้นไม้",
        "badge": "1",
        "frontCustomImg": "image/ภาพ XO ชุดที่ 3/1 เนย.png",
        "questionImg": "image/ภาพ XO ชุดที่ 3/10 คำถามเนย.png",
        "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M42,55 Q40,90 32,95 L68,95 Q60,90 58,55 Z\" fill=\"#96582A\" /><circle cx=\"50\" cy=\"40\" r=\"28\" fill=\"#2E9E44\" /><circle cx=\"34\" cy=\"48\" r=\"20\" fill=\"#258639\" /><circle cx=\"66\" cy=\"48\" r=\"20\" fill=\"#258639\" /><circle cx=\"35\" cy=\"30\" r=\"19\" fill=\"#38B34F\" /><circle cx=\"65\" cy=\"30\" r=\"19\" fill=\"#38B34F\" /><circle cx=\"50\" cy=\"24\" r=\"20\" fill=\"#44C55D\" /></svg>"
    },
    {
        "id": 1,
        "name": "โดนัท",
        "badge": "1",
        "frontCustomImg": "image/ภาพ XO ชุดที่ 3/2 ดอกทิวลิป.png",
        "questionImg": "image/ภาพ XO ชุดที่ 3/11 คำถามดอกทิวลิป.png",
        "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><ellipse cx=\"50\" cy=\"52\" rx=\"42\" ry=\"32\" fill=\"#E8A359\" stroke=\"#C97F37\" stroke-width=\"2\"/><ellipse cx=\"50\" cy=\"52\" rx=\"16\" ry=\"12\" fill=\"#EF5A40\"/><path d=\"M12,48 C15,30 35,24 50,24 C68,24 88,32 88,50 C88,68 76,75 66,69 C60,65 57,75 50,75 C42,75 40,68 32,70 C20,72 10,64 12,48 Z\" fill=\"#F472B6\" /><ellipse cx=\"50\" cy=\"50\" rx=\"15\" ry=\"11\" fill=\"#EF5A40\" /></svg>"
    },
    {
        "id": 2,
        "name": "เรือ",
        "badge": "1",
        "frontCustomImg": "image/ภาพ XO ชุดที่ 3/3 เค้กบลูเบอร์รี่.png",
        "questionImg": "image/ภาพ XO ชุดที่ 3/12 คำถามเค้กบลูเบอร์รี่.png",
        "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><line x1=\"42\" y1=\"20\" x2=\"42\" y2=\"55\" stroke=\"#78350F\" stroke-width=\"3\" /><path d=\"M42,20 L22,26 L42,33 Z\" fill=\"#22C55E\" /><rect x=\"45\" y=\"36\" width=\"30\" height=\"20\" rx=\"3\" fill=\"#FBBF24\" stroke=\"#D97706\" stroke-width=\"1.5\"/><circle cx=\"60\" cy=\"46\" r=\"5\" fill=\"#E0F2FE\" stroke=\"#78350F\" stroke-width=\"2\"/><path d=\"M12,58 Q50,60 88,52 L78,82 Q48,88 22,80 Z\" fill=\"#C2410C\" /></svg>"
    },
    {
        "id": 3,
        "name": "แก้วน้ำ",
        "badge": "1",
        "frontCustomImg": "image/ภาพ XO ชุดที่ 3/4 อูคูเลเล่.png",
        "questionImg": "image/ภาพ XO ชุดที่ 3/13 คำถามอูคูเลเล่.png",
        "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M66,42 C85,42 85,68 66,70\" fill=\"none\" stroke=\"#93C5FD\" stroke-width=\"8\" stroke-linecap=\"round\"/><path d=\"M26,35 L32,84 C32,88 68,88 68,84 L74,35 Z\" fill=\"#BFDBFE\" stroke=\"#60A5FA\" stroke-width=\"2\"/><ellipse cx=\"50\" cy=\"36\" rx=\"24\" ry=\"8\" fill=\"#78350F\" /><polygon points=\"50,52 53,60 62,60 55,65 57,74 50,68 43,74 45,65 38,60 47,60\" fill=\"#4ADE80\" /></svg>"
    },
    {
        "id": 4,
        "name": "รถยนต์",
        "badge": "1",
        "frontCustomImg": "image/ภาพ XO ชุดที่ 3/5 เต่าปาร์ตี้.png",
        "questionImg": "image/ภาพ XO ชุดที่ 3/14 คำถามเต่าปาร์ตี้.png",
        "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M15,62 L24,46 L40,40 L68,40 L82,52 L88,60 L88,72 L15,72 Z\" fill=\"#3B82F6\" /><circle cx=\"32\" cy=\"74\" r=\"11\" fill=\"#1E293B\" /><circle cx=\"72\" cy=\"74\" r=\"11\" fill=\"#1E293B\" /></svg>"
    },
    {
        "id": 5,
        "name": "เมฆฝน",
        "badge": "1",
        "frontCustomImg": "image/ภาพ XO ชุดที่ 3/6 กรรไกร.png",
        "questionImg": "image/ภาพ XO ชุดที่ 3/15 คำถามกรรไกร.png",
        "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><ellipse cx=\"40\" cy=\"46\" rx=\"24\" ry=\"17\" fill=\"#D6D3D1\" /><ellipse cx=\"62\" cy=\"46\" rx=\"22\" ry=\"16\" fill=\"#A8A29E\" /><circle cx=\"48\" cy=\"34\" r=\"17\" fill=\"#E7E5E4\" /><polygon points=\"34,58 26,72 33,72 27,88 42,70 34,70\" fill=\"#FACC15\" /><polygon points=\"62,58 54,72 61,72 55,88 70,70 62,70\" fill=\"#FACC15\" /></svg>"
    },
    {
        "id": 6,
        "name": "แมวน้ำ",
        "badge": "1",
        "frontCustomImg": "image/ภาพ XO ชุดที่ 3/7 ยางลบ.png",
        "questionImg": "image/ภาพ XO ชุดที่ 3/16 คำถามยางลบ.png",
        "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M22,76 C12,65 16,40 38,40 C52,40 70,55 82,45 C86,41 90,44 88,52 C84,68 70,82 45,86 C32,88 24,84 22,76 Z\" fill=\"#CBD5E1\" /><circle cx=\"34\" cy=\"48\" r=\"2.5\" fill=\"#0F172A\" /><circle cx=\"46\" cy=\"48\" r=\"2.5\" fill=\"#0F172A\" /></svg>"
    },
    {
        "id": 7,
        "name": "ร่ม",
        "badge": "1",
        "frontCustomImg": "image/ภาพ XO ชุดที่ 3/8 ดาวเสาร์.png",
        "questionImg": "image/ภาพ XO ชุดที่ 3/17 คำถามดาวเสาร์.png",
        "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M50,22 Q32,25 22,50 Q30,48 38,52 Q44,48 50,52 Q56,48 62,52 Q70,48 78,50 Q68,25 50,22 Z\" fill=\"#F43F5E\" /><line x1=\"50\" y1=\"20\" x2=\"50\" y2=\"78\" stroke=\"#D97706\" stroke-width=\"3\" stroke-linecap=\"round\" /><path d=\"M50,78 C50,86 62,86 62,80\" fill=\"none\" stroke=\"#A855F7\" stroke-width=\"4\" stroke-linecap=\"round\" /></svg>"
    },
    {
        "id": 8,
        "name": "ถุงเท้า",
        "badge": "1",
        "frontCustomImg": "image/ภาพ XO ชุดที่ 3/9 มงกุฎ.png",
        "questionImg": "image/ภาพ XO ชุดที่ 3/18 คำถามมงกุฎ.png",
        "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M35,25 L50,25 L45,55 L58,68 C64,74 58,84 48,82 L34,70 C30,66 32,55 35,50 Z\" fill=\"#15803D\" /><path d=\"M56,36 L70,36 L66,60 L78,74 C83,80 77,88 68,87 L56,76 C52,72 54,62 57,56 Z\" fill=\"#166534\" /></svg>"
    }
];

    // 3 Question sets holder
    let allQuestionSets = [
    [
        {
            "id": 0,
            "name": "ต้นไม้",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 3/1 เนย.png",
            "questionImg": "image/ภาพ XO ชุดที่ 3/10 คำถามเนย.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M42,55 Q40,90 32,95 L68,95 Q60,90 58,55 Z\" fill=\"#96582A\" /><circle cx=\"50\" cy=\"40\" r=\"28\" fill=\"#2E9E44\" /><circle cx=\"34\" cy=\"48\" r=\"20\" fill=\"#258639\" /><circle cx=\"66\" cy=\"48\" r=\"20\" fill=\"#258639\" /><circle cx=\"35\" cy=\"30\" r=\"19\" fill=\"#38B34F\" /><circle cx=\"65\" cy=\"30\" r=\"19\" fill=\"#38B34F\" /><circle cx=\"50\" cy=\"24\" r=\"20\" fill=\"#44C55D\" /></svg>"
        },
        {
            "id": 1,
            "name": "โดนัท",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 3/2 ดอกทิวลิป.png",
            "questionImg": "image/ภาพ XO ชุดที่ 3/11 คำถามดอกทิวลิป.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><ellipse cx=\"50\" cy=\"52\" rx=\"42\" ry=\"32\" fill=\"#E8A359\" stroke=\"#C97F37\" stroke-width=\"2\"/><ellipse cx=\"50\" cy=\"52\" rx=\"16\" ry=\"12\" fill=\"#EF5A40\"/><path d=\"M12,48 C15,30 35,24 50,24 C68,24 88,32 88,50 C88,68 76,75 66,69 C60,65 57,75 50,75 C42,75 40,68 32,70 C20,72 10,64 12,48 Z\" fill=\"#F472B6\" /><ellipse cx=\"50\" cy=\"50\" rx=\"15\" ry=\"11\" fill=\"#EF5A40\" /></svg>"
        },
        {
            "id": 2,
            "name": "เรือ",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 3/3 เค้กบลูเบอร์รี่.png",
            "questionImg": "image/ภาพ XO ชุดที่ 3/12 คำถามเค้กบลูเบอร์รี่.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><line x1=\"42\" y1=\"20\" x2=\"42\" y2=\"55\" stroke=\"#78350F\" stroke-width=\"3\" /><path d=\"M42,20 L22,26 L42,33 Z\" fill=\"#22C55E\" /><rect x=\"45\" y=\"36\" width=\"30\" height=\"20\" rx=\"3\" fill=\"#FBBF24\" stroke=\"#D97706\" stroke-width=\"1.5\"/><circle cx=\"60\" cy=\"46\" r=\"5\" fill=\"#E0F2FE\" stroke=\"#78350F\" stroke-width=\"2\"/><path d=\"M12,58 Q50,60 88,52 L78,82 Q48,88 22,80 Z\" fill=\"#C2410C\" /></svg>"
        },
        {
            "id": 3,
            "name": "แก้วน้ำ",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 3/4 อูคูเลเล่.png",
            "questionImg": "image/ภาพ XO ชุดที่ 3/13 คำถามอูคูเลเล่.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M66,42 C85,42 85,68 66,70\" fill=\"none\" stroke=\"#93C5FD\" stroke-width=\"8\" stroke-linecap=\"round\"/><path d=\"M26,35 L32,84 C32,88 68,88 68,84 L74,35 Z\" fill=\"#BFDBFE\" stroke=\"#60A5FA\" stroke-width=\"2\"/><ellipse cx=\"50\" cy=\"36\" rx=\"24\" ry=\"8\" fill=\"#78350F\" /><polygon points=\"50,52 53,60 62,60 55,65 57,74 50,68 43,74 45,65 38,60 47,60\" fill=\"#4ADE80\" /></svg>"
        },
        {
            "id": 4,
            "name": "รถยนต์",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 3/5 เต่าปาร์ตี้.png",
            "questionImg": "image/ภาพ XO ชุดที่ 3/14 คำถามเต่าปาร์ตี้.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M15,62 L24,46 L40,40 L68,40 L82,52 L88,60 L88,72 L15,72 Z\" fill=\"#3B82F6\" /><circle cx=\"32\" cy=\"74\" r=\"11\" fill=\"#1E293B\" /><circle cx=\"72\" cy=\"74\" r=\"11\" fill=\"#1E293B\" /></svg>"
        },
        {
            "id": 5,
            "name": "เมฆฝน",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 3/6 กรรไกร.png",
            "questionImg": "image/ภาพ XO ชุดที่ 3/15 คำถามกรรไกร.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><ellipse cx=\"40\" cy=\"46\" rx=\"24\" ry=\"17\" fill=\"#D6D3D1\" /><ellipse cx=\"62\" cy=\"46\" rx=\"22\" ry=\"16\" fill=\"#A8A29E\" /><circle cx=\"48\" cy=\"34\" r=\"17\" fill=\"#E7E5E4\" /><polygon points=\"34,58 26,72 33,72 27,88 42,70 34,70\" fill=\"#FACC15\" /><polygon points=\"62,58 54,72 61,72 55,88 70,70 62,70\" fill=\"#FACC15\" /></svg>"
        },
        {
            "id": 6,
            "name": "แมวน้ำ",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 3/7 ยางลบ.png",
            "questionImg": "image/ภาพ XO ชุดที่ 3/16 คำถามยางลบ.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M22,76 C12,65 16,40 38,40 C52,40 70,55 82,45 C86,41 90,44 88,52 C84,68 70,82 45,86 C32,88 24,84 22,76 Z\" fill=\"#CBD5E1\" /><circle cx=\"34\" cy=\"48\" r=\"2.5\" fill=\"#0F172A\" /><circle cx=\"46\" cy=\"48\" r=\"2.5\" fill=\"#0F172A\" /></svg>"
        },
        {
            "id": 7,
            "name": "ร่ม",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 3/8 ดาวเสาร์.png",
            "questionImg": "image/ภาพ XO ชุดที่ 3/17 คำถามดาวเสาร์.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M50,22 Q32,25 22,50 Q30,48 38,52 Q44,48 50,52 Q56,48 62,52 Q70,48 78,50 Q68,25 50,22 Z\" fill=\"#F43F5E\" /><line x1=\"50\" y1=\"20\" x2=\"50\" y2=\"78\" stroke=\"#D97706\" stroke-width=\"3\" stroke-linecap=\"round\" /><path d=\"M50,78 C50,86 62,86 62,80\" fill=\"none\" stroke=\"#A855F7\" stroke-width=\"4\" stroke-linecap=\"round\" /></svg>"
        },
        {
            "id": 8,
            "name": "ถุงเท้า",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 3/9 มงกุฎ.png",
            "questionImg": "image/ภาพ XO ชุดที่ 3/18 คำถามมงกุฎ.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M35,25 L50,25 L45,55 L58,68 C64,74 58,84 48,82 L34,70 C30,66 32,55 35,50 Z\" fill=\"#15803D\" /><path d=\"M56,36 L70,36 L66,60 L78,74 C83,80 77,88 68,87 L56,76 C52,72 54,62 57,56 Z\" fill=\"#166534\" /></svg>"
        }
    ],
    [
        {
            "id": 0,
            "name": "ต้นไม้",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 1/1 ต้นไม้.png",
            "questionImg": "image/ภาพ XO ชุดที่ 1/10 คำถามต้นไม้.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M42,55 Q40,90 32,95 L68,95 Q60,90 58,55 Z\" fill=\"#96582A\" /><circle cx=\"50\" cy=\"40\" r=\"28\" fill=\"#2E9E44\" /><circle cx=\"34\" cy=\"48\" r=\"20\" fill=\"#258639\" /><circle cx=\"66\" cy=\"48\" r=\"20\" fill=\"#258639\" /><circle cx=\"35\" cy=\"30\" r=\"19\" fill=\"#38B34F\" /><circle cx=\"65\" cy=\"30\" r=\"19\" fill=\"#38B34F\" /><circle cx=\"50\" cy=\"24\" r=\"20\" fill=\"#44C55D\" /></svg>"
        },
        {
            "id": 1,
            "name": "โดนัท",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 1/2 โดนัท.png",
            "questionImg": "image/ภาพ XO ชุดที่ 1/11 คำถามโดนัท.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><ellipse cx=\"50\" cy=\"52\" rx=\"42\" ry=\"32\" fill=\"#E8A359\" stroke=\"#C97F37\" stroke-width=\"2\"/><ellipse cx=\"50\" cy=\"52\" rx=\"16\" ry=\"12\" fill=\"#EF5A40\"/><path d=\"M12,48 C15,30 35,24 50,24 C68,24 88,32 88,50 C88,68 76,75 66,69 C60,65 57,75 50,75 C42,75 40,68 32,70 C20,72 10,64 12,48 Z\" fill=\"#F472B6\" /><ellipse cx=\"50\" cy=\"50\" rx=\"15\" ry=\"11\" fill=\"#EF5A40\" /></svg>"
        },
        {
            "id": 2,
            "name": "เรือ",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 1/3 เรือใบ.png",
            "questionImg": "image/ภาพ XO ชุดที่ 1/12 คำถามเรือใบ.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><line x1=\"42\" y1=\"20\" x2=\"42\" y2=\"55\" stroke=\"#78350F\" stroke-width=\"3\" /><path d=\"M42,20 L22,26 L42,33 Z\" fill=\"#22C55E\" /><rect x=\"45\" y=\"36\" width=\"30\" height=\"20\" rx=\"3\" fill=\"#FBBF24\" stroke=\"#D97706\" stroke-width=\"1.5\"/><circle cx=\"60\" cy=\"46\" r=\"5\" fill=\"#E0F2FE\" stroke=\"#78350F\" stroke-width=\"2\"/><path d=\"M12,58 Q50,60 88,52 L78,82 Q48,88 22,80 Z\" fill=\"#C2410C\" /></svg>"
        },
        {
            "id": 3,
            "name": "แก้วน้ำ",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 1/4 แก้วกาแฟ.png",
            "questionImg": "image/ภาพ XO ชุดที่ 1/13 คำถามแก้วกาแฟ.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M66,42 C85,42 85,68 66,70\" fill=\"none\" stroke=\"#93C5FD\" stroke-width=\"8\" stroke-linecap=\"round\"/><path d=\"M26,35 L32,84 C32,88 68,88 68,84 L74,35 Z\" fill=\"#BFDBFE\" stroke=\"#60A5FA\" stroke-width=\"2\"/><ellipse cx=\"50\" cy=\"36\" rx=\"24\" ry=\"8\" fill=\"#78350F\" /><polygon points=\"50,52 53,60 62,60 55,65 57,74 50,68 43,74 45,65 38,60 47,60\" fill=\"#4ADE80\" /></svg>"
        },
        {
            "id": 4,
            "name": "รถยนต์",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 1/5 รถสีน้ำเงิน.png",
            "questionImg": "image/ภาพ XO ชุดที่ 1/14 คำถามรถสีน้ำเงิน.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M15,62 L24,46 L40,40 L68,40 L82,52 L88,60 L88,72 L15,72 Z\" fill=\"#3B82F6\" /><circle cx=\"32\" cy=\"74\" r=\"11\" fill=\"#1E293B\" /><circle cx=\"72\" cy=\"74\" r=\"11\" fill=\"#1E293B\" /></svg>"
        },
        {
            "id": 5,
            "name": "เมฆฝน",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 1/6 เมฆฝน.png",
            "questionImg": "image/ภาพ XO ชุดที่ 1/15 คำถามเมฆฝน.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><ellipse cx=\"40\" cy=\"46\" rx=\"24\" ry=\"17\" fill=\"#D6D3D1\" /><ellipse cx=\"62\" cy=\"46\" rx=\"22\" ry=\"16\" fill=\"#A8A29E\" /><circle cx=\"48\" cy=\"34\" r=\"17\" fill=\"#E7E5E4\" /><polygon points=\"34,58 26,72 33,72 27,88 42,70 34,70\" fill=\"#FACC15\" /><polygon points=\"62,58 54,72 61,72 55,88 70,70 62,70\" fill=\"#FACC15\" /></svg>"
        },
        {
            "id": 6,
            "name": "แมวน้ำ",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 1/7 แมวน้ำ.png",
            "questionImg": "image/ภาพ XO ชุดที่ 1/16 คำถามแมวน้ำ.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M22,76 C12,65 16,40 38,40 C52,40 70,55 82,45 C86,41 90,44 88,52 C84,68 70,82 45,86 C32,88 24,84 22,76 Z\" fill=\"#CBD5E1\" /><circle cx=\"34\" cy=\"48\" r=\"2.5\" fill=\"#0F172A\" /><circle cx=\"46\" cy=\"48\" r=\"2.5\" fill=\"#0F172A\" /></svg>"
        },
        {
            "id": 7,
            "name": "ร่ม",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 1/8 ร่มสีรุ้ง.png",
            "questionImg": "image/ภาพ XO ชุดที่ 1/17 คำถามร่มสีรุ้ง.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M50,22 Q32,25 22,50 Q30,48 38,52 Q44,48 50,52 Q56,48 62,52 Q70,48 78,50 Q68,25 50,22 Z\" fill=\"#F43F5E\" /><line x1=\"50\" y1=\"20\" x2=\"50\" y2=\"78\" stroke=\"#D97706\" stroke-width=\"3\" stroke-linecap=\"round\" /><path d=\"M50,78 C50,86 62,86 62,80\" fill=\"none\" stroke=\"#A855F7\" stroke-width=\"4\" stroke-linecap=\"round\" /></svg>"
        },
        {
            "id": 8,
            "name": "ถุงเท้า",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 1/9 ถุงเท้า.png",
            "questionImg": "image/ภาพ XO ชุดที่ 1/18 คำถามถุงเท้า.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M35,25 L50,25 L45,55 L58,68 C64,74 58,84 48,82 L34,70 C30,66 32,55 35,50 Z\" fill=\"#15803D\" /><path d=\"M56,36 L70,36 L66,60 L78,74 C83,80 77,88 68,87 L56,76 C52,72 54,62 57,56 Z\" fill=\"#166534\" /></svg>"
        }
    ],
    [
        {
            "id": 0,
            "name": "ต้นไม้",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 2/1 รถแดง.png",
            "questionImg": "image/ภาพ XO ชุดที่ 2/10 คำถามรถแดง.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M42,55 Q40,90 32,95 L68,95 Q60,90 58,55 Z\" fill=\"#96582A\" /><circle cx=\"50\" cy=\"40\" r=\"28\" fill=\"#2E9E44\" /><circle cx=\"34\" cy=\"48\" r=\"20\" fill=\"#258639\" /><circle cx=\"66\" cy=\"48\" r=\"20\" fill=\"#258639\" /><circle cx=\"35\" cy=\"30\" r=\"19\" fill=\"#38B34F\" /><circle cx=\"65\" cy=\"30\" r=\"19\" fill=\"#38B34F\" /><circle cx=\"50\" cy=\"24\" r=\"20\" fill=\"#44C55D\" /></svg>"
        },
        {
            "id": 1,
            "name": "โดนัท",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 2/2 หมวกแก็ป.png",
            "questionImg": "image/ภาพ XO ชุดที่ 2/11 คำถามหมวกแก็ป.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><ellipse cx=\"50\" cy=\"52\" rx=\"42\" ry=\"32\" fill=\"#E8A359\" stroke=\"#C97F37\" stroke-width=\"2\"/><ellipse cx=\"50\" cy=\"52\" rx=\"16\" ry=\"12\" fill=\"#EF5A40\"/><path d=\"M12,48 C15,30 35,24 50,24 C68,24 88,32 88,50 C88,68 76,75 66,69 C60,65 57,75 50,75 C42,75 40,68 32,70 C20,72 10,64 12,48 Z\" fill=\"#F472B6\" /><ellipse cx=\"50\" cy=\"50\" rx=\"15\" ry=\"11\" fill=\"#EF5A40\" /></svg>"
        },
        {
            "id": 2,
            "name": "เรือ",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 2/3 ชิงช้าสวรรค์.png",
            "questionImg": "image/ภาพ XO ชุดที่ 2/12 คำถามชิงช้าสวรรค์.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><line x1=\"42\" y1=\"20\" x2=\"42\" y2=\"55\" stroke=\"#78350F\" stroke-width=\"3\" /><path d=\"M42,20 L22,26 L42,33 Z\" fill=\"#22C55E\" /><rect x=\"45\" y=\"36\" width=\"30\" height=\"20\" rx=\"3\" fill=\"#FBBF24\" stroke=\"#D97706\" stroke-width=\"1.5\"/><circle cx=\"60\" cy=\"46\" r=\"5\" fill=\"#E0F2FE\" stroke=\"#78350F\" stroke-width=\"2\"/><path d=\"M12,58 Q50,60 88,52 L78,82 Q48,88 22,80 Z\" fill=\"#C2410C\" /></svg>"
        },
        {
            "id": 3,
            "name": "แก้วน้ำ",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 2/4 เสื้อกันฝน.png",
            "questionImg": "image/ภาพ XO ชุดที่ 2/13 คำถามเสื้อกันฝน.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M66,42 C85,42 85,68 66,70\" fill=\"none\" stroke=\"#93C5FD\" stroke-width=\"8\" stroke-linecap=\"round\"/><path d=\"M26,35 L32,84 C32,88 68,88 68,84 L74,35 Z\" fill=\"#BFDBFE\" stroke=\"#60A5FA\" stroke-width=\"2\"/><ellipse cx=\"50\" cy=\"36\" rx=\"24\" ry=\"8\" fill=\"#78350F\" /><polygon points=\"50,52 53,60 62,60 55,65 57,74 50,68 43,74 45,65 38,60 47,60\" fill=\"#4ADE80\" /></svg>"
        },
        {
            "id": 4,
            "name": "รถยนต์",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 2/5 เมฆกับแดด.png",
            "questionImg": "image/ภาพ XO ชุดที่ 2/14 คำถามเมฆกับแดด.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M15,62 L24,46 L40,40 L68,40 L82,52 L88,60 L88,72 L15,72 Z\" fill=\"#3B82F6\" /><circle cx=\"32\" cy=\"74\" r=\"11\" fill=\"#1E293B\" /><circle cx=\"72\" cy=\"74\" r=\"11\" fill=\"#1E293B\" /></svg>"
        },
        {
            "id": 5,
            "name": "เมฆฝน",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 2/6 เห็ด.png",
            "questionImg": "image/ภาพ XO ชุดที่ 2/15 คำถามเห็ด.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><ellipse cx=\"40\" cy=\"46\" rx=\"24\" ry=\"17\" fill=\"#D6D3D1\" /><ellipse cx=\"62\" cy=\"46\" rx=\"22\" ry=\"16\" fill=\"#A8A29E\" /><circle cx=\"48\" cy=\"34\" r=\"17\" fill=\"#E7E5E4\" /><polygon points=\"34,58 26,72 33,72 27,88 42,70 34,70\" fill=\"#FACC15\" /><polygon points=\"62,58 54,72 61,72 55,88 70,70 62,70\" fill=\"#FACC15\" /></svg>"
        },
        {
            "id": 6,
            "name": "แมวน้ำ",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 2/7 บ้านดิน.png",
            "questionImg": "image/ภาพ XO ชุดที่ 2/16 คำถามบ้านดิน.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M22,76 C12,65 16,40 38,40 C52,40 70,55 82,45 C86,41 90,44 88,52 C84,68 70,82 45,86 C32,88 24,84 22,76 Z\" fill=\"#CBD5E1\" /><circle cx=\"34\" cy=\"48\" r=\"2.5\" fill=\"#0F172A\" /><circle cx=\"46\" cy=\"48\" r=\"2.5\" fill=\"#0F172A\" /></svg>"
        },
        {
            "id": 7,
            "name": "ร่ม",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 2/8 แมวลายสลิด.png",
            "questionImg": "image/ภาพ XO ชุดที่ 2/17 คำถามแมวลายสลิด.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M50,22 Q32,25 22,50 Q30,48 38,52 Q44,48 50,52 Q56,48 62,52 Q70,48 78,50 Q68,25 50,22 Z\" fill=\"#F43F5E\" /><line x1=\"50\" y1=\"20\" x2=\"50\" y2=\"78\" stroke=\"#D97706\" stroke-width=\"3\" stroke-linecap=\"round\" /><path d=\"M50,78 C50,86 62,86 62,80\" fill=\"none\" stroke=\"#A855F7\" stroke-width=\"4\" stroke-linecap=\"round\" /></svg>"
        },
        {
            "id": 8,
            "name": "ถุงเท้า",
            "badge": "1",
            "frontCustomImg": "image/ภาพ XO ชุดที่ 2/9 ไข่ต้ม.png",
            "questionImg": "image/ภาพ XO ชุดที่ 2/18 คำถามไข่ต้ม.png",
            "svg": "<svg viewBox=\"0 0 100 100\" class=\"w-full h-full\" preserveAspectRatio=\"none\"><rect width=\"100\" height=\"100\" fill=\"#EE5B3E\"/><path d=\"M35,25 L50,25 L45,55 L58,68 C64,74 58,84 48,82 L34,70 C30,66 32,55 35,50 Z\" fill=\"#15803D\" /><path d=\"M56,36 L70,36 L66,60 L78,74 C83,80 77,88 68,87 L56,76 C52,72 54,62 57,56 Z\" fill=\"#166534\" /></svg>"
        }
    ]
];

    // Card flip states per set (No score tracking)
    let setFlipStates = [
      Array(9).fill(false),
      Array(9).fill(false),
      Array(9).fill(false)
    ];

    let currentSetIndex = 0;
    let activeModalIndex = null;
    const STORAGE_KEY_SETS = 'thai_flipcards_3sets_clean_v7';

    function loadAllSets() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_SETS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === 3) {
            allQuestionSets = parsed;
          }
        }
      } catch (e) {
        console.warn('Could not load sets', e);
      }
    }

    function saveAllSets() {
      try {
        localStorage.setItem(STORAGE_KEY_SETS, JSON.stringify(allQuestionSets));
      } catch (e) {
        console.warn('Storage limit reached while saving sets', e);
      }
    }

    /* ========================================================
       4. SWITCH QUESTION SET (ชุดที่ 1 / ชุดที่ 2 / ชุดที่ 3)
       ======================================================== */
    function switchQuestionSet(setIndex) {
      if (currentSetIndex === setIndex) return;

      currentSetIndex = setIndex;
      playTone(550, 'triangle', 0.12);

      // Update Top Tabs styling
      for (let i = 0; i < 3; i++) {
        const tab = document.getElementById(`set-tab-${i}`);
        if (i === setIndex) {
          tab.className = "px-6 py-2.5 rounded-xl font-black text-base transition-all duration-200 shadow-md bg-gradient-to-r from-orange-500 to-amber-500 text-white scale-105";
        } else {
          tab.className = "px-6 py-2.5 rounded-xl font-black text-base text-slate-700 hover:bg-white/80 transition-all duration-200";
        }
      }

      renderGrid();
    }

    /* ========================================================
       5. RENDER 3x3 GRID (FULL BLEED, NO LABELS, NO SCORE TAGS)
       ======================================================== */
    const container = document.getElementById('grid-container');

    function renderGrid() {
      container.innerHTML = '';
      const activeCards = allQuestionSets[currentSetIndex];
      const activeFlips = setFlipStates[currentSetIndex];

      activeCards.forEach((card, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'perspective-1200 w-full h-full cursor-pointer select-none';

        // Front Face: edge-to-edge full bleed
        const frontImage = card.frontCustomImg
          ? `<img src="${card.frontCustomImg}" alt="Card ${index+1}" class="w-full h-full object-cover">`
          : card.svg;

        const backPreview = card.questionImg
          ? `<img src="${card.questionImg}" alt="Question" class="w-full h-full object-contain">`
          : `<div class="text-orange-950 font-black text-xl">❓ คลิกเพื่อเปิดดูภาพคำถาม</div>`;

        const isFlipped = activeFlips[index];
        const cardBgClass = currentSetIndex === 0 ? 'bg-[#6CCEE6]' : (currentSetIndex === 1 ? 'bg-yellow-400' : 'bg-purple-300');

        wrapper.innerHTML = `
          <div id="card-${index}" class="card-flipper ${isFlipped ? 'flipped' : ''} relative w-full h-full transform-style-3d rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
            
            <!-- FRONT FACE (เต็มช่อง 100% ไร้ชื่อภาพ ไร้เลขป้ายมุมการ์ด ไร้ป้ายคะแนน) -->
            <div class="card-front absolute inset-0 w-full h-full backface-hidden ${cardBgClass} flex items-center justify-center overflow-hidden"
                 onclick="handleCardClick(${index})">
              
              <!-- Full bleed graphic container -->
              <div class="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
                ${frontImage}
              </div>

            </div>

            <!-- BACK FACE -->
            <div class="card-back absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white border-4 border-orange-500 p-4 flex flex-col items-center justify-center shadow-2xl text-center overflow-hidden"
                 onclick="handleCardClick(${index})">
              <div class="flex items-center gap-1.5 mb-2">
                <span class="px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-xs font-black">ชุดที่ ${currentSetIndex + 1}</span>
                <span class="text-sm font-bold text-orange-600">ข้อที่ ${index + 1}</span>
              </div>
              <div class="flex-grow w-full flex items-center justify-center overflow-hidden">
                ${backPreview}
              </div>
              <span class="text-xs font-bold text-orange-500 animate-pulse mt-2">กำลังเปิดเต็มหน้าจอ...</span>
            </div>

          </div>
        `;
        container.appendChild(wrapper);
      });
    }

    /* ========================================================
       6. MODAL INTERACTION (FLIP -> OPEN -> BACK & FLIP DOWN)
       ======================================================== */
    function handleCardClick(index) {
      activeModalIndex = index;
      playFlipSound();

      const cardEl = document.getElementById(`card-${index}`);
      if (cardEl) {
        cardEl.classList.add('flipped');
        setFlipStates[currentSetIndex][index] = true;
      }

      setTimeout(() => {
        openLargeQuestionModal(index);
      }, 260);
    }

    function openLargeQuestionModal(index) {
      const card = allQuestionSets[currentSetIndex][index];
      if (!card) return;

      activeModalIndex = index;

      document.getElementById('modal-card-title').textContent = `${index + 1}. ${card.name}`;
      document.getElementById('modal-set-badge').textContent = `ชุดที่ ${currentSetIndex + 1}`;

      const wrapper = document.getElementById('modal-question-wrapper');
      if (card.questionImg) {
        wrapper.innerHTML = `
          <div class="w-full h-full flex flex-col items-center justify-center p-2">
            <div class="w-full h-[710px] rounded-3xl overflow-hidden border-2 border-orange-200 bg-white p-4 shadow-xl flex items-center justify-center">
              <img src="${card.questionImg}" alt="ไฟล์โจทย์คำถาม ชุดที่ ${currentSetIndex + 1}" class="h-full w-full object-contain rounded-2xl select-none">
            </div>
          </div>
        `;
      } else {
        wrapper.innerHTML = `
          <div class="p-16 text-center bg-white rounded-3xl border-4 border-dashed border-orange-300 max-w-xl w-full shadow-md">
            <div class="text-6xl mb-4">🖼️</div>
            <h3 class="text-2xl font-black text-slate-800 mb-2">ยังไม่มีไฟล์ภาพโจทย์สำหรับข้อนี้ (ชุดที่ ${currentSetIndex + 1})</h3>
            <p class="text-base text-slate-500 mb-6">คุณสามารถคลิกปุ่ม <b>"จัดการรูป & โจทย์ 3 ชุด"</b> ด้านบน เพื่ออัปโหลดไฟล์ภาพโจทย์ที่คุณเตรียมไว้ได้ทันที</p>
            <button onclick="closeLargeQuestionModal(); openEditorModal(${currentSetIndex}, ${index});" class="px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold text-base hover:bg-orange-600 transition shadow-lg">
              อัปโหลดภาพโจทย์ข้อนี้ตอนนี้
            </button>
          </div>
        `;
      }

      const modal = document.getElementById('large-question-modal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    // CLOSE & AUTOMATICALLY FLIP CARD FACE-DOWN
    function closeLargeQuestionModal() {
      const modal = document.getElementById('large-question-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');

      if (activeModalIndex !== null) {
        const cardEl = document.getElementById(`card-${activeModalIndex}`);
        if (cardEl) {
          cardEl.classList.remove('flipped');
          setFlipStates[currentSetIndex][activeModalIndex] = false;
          playFlipSound();
        }
        activeModalIndex = null;
      }
    }

    /* ========================================================
       7. CANVAS IMAGE COMPRESSION & UPLOADER ENGINE
       ======================================================== */
    function compressImage(file, maxDim = 1100, quality = 0.84) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxDim) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              }
            } else {
              if (height > maxDim) {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            resolve(canvas.toDataURL('image/jpeg', quality));
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    let currentModalSetIndex = 0;
    let currentEditingIndex = 0;
    let tempFrontImg = '';
    let tempQuestionImg = '';

    function openEditorModal(setIdx = 0, cardIdx = 0) {
      currentModalSetIndex = setIdx;
      currentEditingIndex = cardIdx;

      updateModalSetTabs();
      renderEditorCardTabs();
      loadCardToEditor(currentEditingIndex);

      const modal = document.getElementById('editor-modal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    function closeEditorModal() {
      const modal = document.getElementById('editor-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    function switchModalSet(setIdx) {
      saveCurrentCardEdits(false);
      currentModalSetIndex = setIdx;
      updateModalSetTabs();
      renderEditorCardTabs();
      loadCardToEditor(currentEditingIndex);
    }

    function updateModalSetTabs() {
      for (let i = 0; i < 3; i++) {
        const tab = document.getElementById(`modal-set-tab-${i}`);
        if (i === currentModalSetIndex) {
          tab.className = "px-4 py-1.5 rounded-lg text-xs font-black transition bg-orange-500 text-white shadow";
        } else {
          tab.className = "px-4 py-1.5 rounded-lg text-xs font-black transition bg-slate-800 text-slate-300 hover:bg-slate-700";
        }
      }
    }

    function renderEditorCardTabs() {
      const tabs = document.getElementById('card-tabs');
      tabs.innerHTML = '';
      allQuestionSets[currentModalSetIndex].forEach((c, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition ${
          idx === currentEditingIndex
            ? 'bg-orange-500 text-white shadow-md'
            : 'bg-white hover:bg-orange-100 text-slate-700 border border-orange-200'
        }`;
        btn.textContent = `${idx + 1}. ${c.name}`;
        btn.onclick = () => {
          saveCurrentCardEdits(false);
          currentEditingIndex = idx;
          renderEditorCardTabs();
          loadCardToEditor(idx);
        };
        tabs.appendChild(btn);
      });
    }

    function loadCardToEditor(idx) {
      const card = allQuestionSets[currentModalSetIndex][idx];
      document.getElementById('edit-name').value = card.name || '';
      document.getElementById('edit-badge').value = card.badge || (idx + 1);

      tempFrontImg = card.frontCustomImg || '';
      tempQuestionImg = card.questionImg || '';

      updateFrontPreview();
      updateQuestionPreview();
    }

    function updateFrontPreview() {
      const box = document.getElementById('front-preview-box');
      if (tempFrontImg) {
        box.innerHTML = `<img src="${tempFrontImg}" class="w-full h-full object-cover">`;
      } else {
        box.innerHTML = allQuestionSets[currentModalSetIndex][currentEditingIndex].svg;
      }
    }

    function updateQuestionPreview() {
      const box = document.getElementById('question-preview-box');
      if (tempQuestionImg) {
        box.innerHTML = `<img src="${tempQuestionImg}" class="w-full h-full object-contain">`;
      } else {
        box.innerHTML = `<span class="text-slate-400 text-xs text-center font-bold">ยังไม่มีภาพโจทย์คำถาม</span>`;
      }
    }

    function setupFileInputs() {
      const frontInput = document.getElementById('front-file-input');
      frontInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        tempFrontImg = await compressImage(file, 900, 0.85);
        updateFrontPreview();
      });

      const qInput = document.getElementById('question-file-input');
      qInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        tempQuestionImg = await compressImage(file, 1280, 0.88);
        updateQuestionPreview();
      });
    }

    function clearFrontCustomImage() {
      tempFrontImg = '';
      document.getElementById('front-file-input').value = '';
      updateFrontPreview();
    }

    function clearQuestionCustomImage() {
      tempQuestionImg = '';
      document.getElementById('question-file-input').value = '';
      updateQuestionPreview();
    }

    // Helper: Copy front image across all 3 question sets for convenience
    function copyFrontImagesToAllSets() {
      if (!tempFrontImg) return;
      for (let s = 0; s < 3; s++) {
        allQuestionSets[s][currentEditingIndex].frontCustomImg = tempFrontImg;
      }
      saveAllSets();
      if (currentSetIndex === currentModalSetIndex) {
        renderGrid();
      }
      playTone(660, 'sine', 0.1);
    }

    function saveCurrentCardEdits(shouldCloseModal = true) {
      const card = allQuestionSets[currentModalSetIndex][currentEditingIndex];
      card.name = document.getElementById('edit-name').value.trim() || `ข้อที่ ${currentEditingIndex + 1}`;
      card.badge = document.getElementById('edit-badge').value.trim() || `${currentEditingIndex + 1}`;
      card.frontCustomImg = tempFrontImg;
      card.questionImg = tempQuestionImg;

      saveAllSets();
      renderGrid();

      if (shouldCloseModal) {
        closeEditorModal();
        playSuccessSound();
      }
    }

    function restoreCardToDefault(setIdx, cardIdx) {
      allQuestionSets[setIdx][cardIdx] = JSON.parse(JSON.stringify(DEFAULT_BASE_CARDS[cardIdx]));
      loadCardToEditor(cardIdx);
      saveAllSets();
      renderGrid();
      playTone(520, 'triangle', 0.15);
    }

    function exportAllSetsJSON() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allQuestionSets, null, 2));
      const dlAnchor = document.createElement('a');
      dlAnchor.setAttribute("href", dataStr);
      dlAnchor.setAttribute("download", `xo_flipcards_3sets_1920_${Date.now()}.json`);
      dlAnchor.click();
    }

    function importAllSetsJSON(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(event) {
        try {
          const imported = JSON.parse(event.target.result);
          if (Array.isArray(imported) && imported.length === 3) {
            allQuestionSets = imported;
            saveAllSets();
            renderGrid();
            playSuccessSound();
          }
        } catch (err) {
          console.error('Invalid JSON file', err);
        }
      };
      reader.readAsText(file);
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const qModal = document.getElementById('large-question-modal');
        if (!qModal.classList.contains('hidden')) {
          closeLargeQuestionModal();
        }
        const edModal = document.getElementById('editor-modal');
        if (!edModal.classList.contains('hidden')) {
          closeEditorModal();
        }
      }
    });

    window.onload = function() {
      resizeStage();
      loadAllSets();
      renderGrid();
      setupFileInputs();
    };