/* Chapter 3 — The Fractured Lab
   - shard particle ambience
   - 13 questions (riddles, story, logic)
   - scoring & reveal
   - exposes global submitAnswers()
*/

(function(){
  // spawn shard-like particles
  const pCount = 36;
  function spawnShards(){
    const layer = document.getElementById('shards');
    if(!layer) return;
    layer.innerHTML = '';
    for(let i=0;i<pCount;i++){
      const el = document.createElement('div');
      el.className = 'shard';
      const w = (Math.random()*14+4).toFixed(2);
      const h = (Math.random()*40+12).toFixed(2);
      el.style.width = w + 'px';
      el.style.height = h + 'px';
      el.style.left = Math.random()*100 + '%';
      el.style.top = Math.random()*100 + '%';
      el.style.opacity = (Math.random()*0.08+0.02).toString();
      el.style.transform = `rotate(${Math.random()*360}deg)`;
      layer.appendChild(el);
      const dx = (Math.random()-0.5)*200;
      const dy = (Math.random()-0.5)*200;
      el.animate([{transform:`translate(0,0) rotate(${Math.random()*360}deg)`},{transform:`translate(${dx}px,${dy}px) rotate(${Math.random()*360}deg)`}],{duration:10000+Math.random()*16000,iterations:Infinity,direction:'alternate'});
    }
  }
  spawnShards();

  // questions list (13)
  const questions = [
    { q:"Riddle — I build from two previous to become new; petals and shells know my cue. Which sequence?", A:"Prime", B:"Arithmetic", C:"Fibonacci", D:"Factorial", correct:"C" },
    { q:"Story — Which lab object orbited like a small planet after the fracture?", A:"A beaker", B:"A metal lid", C:"A glass bead", D:"A ruler", correct:"C" },
    { q:"Story — Who touched the cracked formula and felt a cold spark?", A:"Aarav", B:"Suryansh", C:"Vaishnav", D:"Sia", correct:"B" },
    { q:"Observation — The broken glass pattern showed rotational symmetry of order 3. How many repeats in a full rotation (360°)?", A:"3", B:"6", C:"9", D:"4", correct:"A" },
    { q:"Logic — Transform: if f(n)=n^2, f(3)=9, what is f(4)?", A:"8", B:"12", C:"16", D:"20", correct:"C" },
    { q:"Pattern — The lab fracture formed repeating triangles. The simplest triangle count in a triangular number sequence for n=4 is?", A:"6", B:"10", C:"4", D:"8", correct:"A" },
    { q:"Inference — The torn formula read: 'Sum(n)=Sum(n-1)+n'. This best matches which concept?", A:"Arithmetic series", B:"Geometric series", C:"Prime checking", D:"Factorials", correct:"A" },
    { q:"Riddle — I slice a circle without being whole; some call my name like dessert. What am I?", A:"Arc", B:"Sector", C:"Slice", D:"Chord", correct:"C" },
    { q:"Observation — Which character used a phone to photograph the glass reflections?", A:"Sia", B:"Aarav", C:"Suryansh", D:"Vaishnav", correct:"D" },
    { q:"Critical — The lab's lit pattern counted 2, 4, 8, 16. The pattern is an example of?", A:"Exponential growth", B:"Arithmetic change", C:"Fibonacci", D:"Random", correct:"A" },
    { q:"Pattern — The formula's missing term suggested 'n=5' yields 5th Fibonacci = ?", A:"5", B:"8", C:"3", D:"13", correct:"B" },
    { q:"Wrap — The fractured motif repeated a 'broken circle' glyph — this most closely symbolizes?", A:"Completion", B:"Missing slice", C:"Infinite loop", D:"Rotation", correct:"B" },
    { q:"Final — The lab's last clue asked them to convert binary '1010' to decimal. What is it?", A:"8", B:"10", C:"12", D:"14", correct:"B" }
  ];

  // render questions
  function render(){
    const area = document.getElementById('questionArea');
    if(!area) return;
    area.innerHTML = '';
    questions.forEach((it, idx)=>{
      const block = document.createElement('div');
      block.className = 'question';
      let html = `<p>${it.q}</p>`;
      ['A','B','C','D'].forEach(letter=>{
        html += `<label><input type="radio" name="q${idx}" value="${letter}"> ${letter}) ${it[letter]}</label>`;
      });
      block.innerHTML = html;
      area.appendChild(block);
    });
  }

  // begin button behaviour
  const beginBtn = document.getElementById('beginBtn');
  const intro = document.getElementById('intro');
  const quiz = document.getElementById('quiz');
  if(beginBtn){
    beginBtn.addEventListener('click', ()=>{
      if(intro) intro.classList.add('hidden');
      if(quiz) quiz.classList.remove('hidden');
      render();
      window.scrollTo({top:0,behavior:'smooth'});
    });
  } else {
    render();
  }

  // scoring & reveal
  function computeScore(){
    let s=0;
    questions.forEach((it, idx)=>{
      const sel = document.querySelector(`input[name="q${idx}"]:checked`);
      if(sel && sel.value === it.correct) s++;
    });
    return s;
  }

  function revealFact(){
    const facts = [
      "Fractured patterns often hide simple series — the lab's cracks echo Fibonacci and powers of two.",
      "Broken glass and molecular symmetry are both studied using geometry and group patterns.",
      "Binary clues like '1010' are common puzzles: they translate directly to decimal representations."
    ];
    const idx = Math.floor(Math.random()*facts.length);
    const ft = document.getElementById('factText');
    if(ft) ft.innerText = facts[idx];
    const factSection = document.getElementById('fact');
    if(factSection) factSection.classList.remove('hidden');
    const next = document.getElementById('nextLink');
    if(next) next.style.display = 'inline-block';
    try{ localStorage.setItem('projectpi_ch3_solved','1'); }catch(e){}
  }

  // expose global submitAnswers
  window.submitAnswers = function(){
    const score = computeScore();
    const txt = document.getElementById('scoreText');
    if(txt) txt.innerText = `Score: ${score}/${questions.length} (${Math.round((score/questions.length)*100)}%)`;
    if(score >= Math.ceil(questions.length * 0.6)){
      revealFact();
    } else {
      if(txt) txt.style.color = '#ffd1d1';
      const g = document.querySelector('.glitch');
      if(g) g.animate([{transform:'scale(1)'},{transform:'scale(0.98)'},{transform:'scale(1)'}],{duration:360,iterations:1});
    }
  };

  // attach submit
  const submitBtn = document.getElementById('submitBtn');
  if(submitBtn) submitBtn.addEventListener('click', ()=>{ window.submitAnswers(); });

  // reset
  const resetBtn = document.getElementById('resetBtn');
  if(resetBtn) resetBtn.addEventListener('click', ()=>{
    document.querySelectorAll('input[type=radio]').forEach(el=>el.checked=false);
    const t = document.getElementById('scoreText');
    if(t){ t.innerText=''; t.style.color=''; }
  });

  // auto-load if solved
  try{
    if(localStorage.getItem('projectpi_ch3_solved') === '1'){
      render();
      if(intro) intro.classList.add('hidden');
      if(quiz) quiz.classList.remove('hidden');
      revealFact();
    }
  }catch(e){}
})();
