const storageWarriors = 'rpg@warriors'
const availableModals = ['attributes', 'books', 'warriors'];
let warriorsPayload = undefined;

const getMainPlayer = () => {
  const main = getPlayer();
  
  if(!main)  return;

  const parsed = playerConstructor(main)
  
  if(!parsed.bio.nome) return;

  return parsed;
}
const getWarriors = () => {
  const warriors = localStorage.getItem(storageWarriors);
  try{ return JSON.parse(warriors); }
  catch(e){ return undefined; }
}
const setWarriors = (warriors) => {
  warriorsPayload = JSON.stringify(warriors)
  localStorage.setItem(storageWarriors, warriorsPayload)
}

const app = new Vue({
  el: '#app',
  data: {
    warriors: [],
    game: {
      is_auto_saved: false,
      modal: {
        is_open_attributes: false,
        is_open_books: false,
        is_open_warriors: false
      },
      magicians,
      malisons,
      test_attribute: {
        max: 0,
        current: 0,
        base: 20,
        grid: Array.from({ length: 20 }).map((_,i) => {
          let points = 20 - i;
          
          let twentyPercent = Math.round(points * .2); 
          let fortyPercent = Math.round(points * .4);
          const invalidRange = ['','']

          let extreme = twentyPercent === 0 ? invalidRange : [1, twentyPercent];              
          let good = fortyPercent === 0 ? invalidRange : [Number(extreme[1]) + 1, Number(extreme[1]) + fortyPercent];
          let regular = [good[1] + 1, points];

          let rest = 20 - points;

          let fiftyPercent = rest <= 0 ? 0 : Math.round(rest * .5);

          let bad = rest <= 0 || regular[1] === 20 ? invalidRange : [regular[1] + 1, regular[1] + fiftyPercent];
          let terrible = rest <= 0 || bad[1] === 20 ? invalidRange : [bad[1] + 1, 20];
          return { points, extreme, good, regular, bad, terrible }
        })
      },
      books: { current: 'grimorios' },
      json_warriors: ''
    }
  },
  mounted() {
    //#region LOAD WARRIORS
    const main = getMainPlayer();

    if(main) this.warriors.push(
      this.warriorConstructor(main, 'main')
    );
    
    this.warriors.push(...(getWarriors() ?? []).map(
      (warrior) => this.warriorConstructor(warrior, 'npc')
    ));

    // this.warriors.push(...[
    //   this.warriorConstructor({
    //     name: 'Mago Abbados',
    //     attr: { ataque: 8, defesa: 9, sabedoria: 15 },
    //     progress_attr: { vida: 14, modificador_vida: '' },
    //     note: ''
    //   }, 'npc'),
    //   this.warriorConstructor({
    //     name: 'Varogue I',
    //     attr: { defesa: 13, ataque: 15 },
    //     progress_attr: { vida: 24, modificador_vida: '' },
    //     note: 'Dano 1d6 + 2'
    //   }, 'npc'),
    //   this.warriorConstructor({
    //     name: 'Varogue II',
    //     attr: { defesa: 13, ataque: 15 },
    //     progress_attr: { vida: 24, modificador_vida: '' },
    //     note: 'Dano 1d6 + 2'
    //   }, 'npc'),
    //   this.warriorConstructor({
    //     name: 'Nebelor',
    //     attr: { defesa: 12, ataque: 13 },
    //     progress_attr: { vida: 18, modificador_vida: '' },
    //     note: '* Precisa ser controlado por um feiticeiro\n\n1d4 para decidir o tipo de ataque\n\n#AT1 1d6\n\n#AT2 toque agonizante(1d6 efeito)\n1-3 pele chamuscada (1d6)\n4-5 pele escarificada (2d6)\n6 pele esfolada 3d6'
    //   }, 'npc'),
    //   this.warriorConstructor({
    //     name: 'Serpente Gigante',
    //     attr: { defesa: 15, ataque: 16 },
    //     progress_attr: { vida: 28, modificador_vida: '' },
    //     note: '* Teste de agi. do inimigo p/ atacar despercebido (dif: bom)\n* 1d4 para saber o tipo de ataque\n\n#AT1 Picada: 2d6 + veneno(5 pontos depois de 3 rodadas se não curar)\n\n#AT2 Prender: o inimigo perde a rodada tendo que fazer um teste de força contra o dela, se perder, na próxima sofre o #AT1. Neste ataque os ataques de surpresa tem vantagem.'
    //   }, 'npc'),
    //   this.warriorConstructor({
    //     name: 'Feit. Bhur',
    //     attr: { defesa: 13, ataque: 6, sabedoria: 15 },
    //     progress_attr: { vida: 13, modificador_vida: '' },
    //     note: ''
    //   }, 'npc'),
    //   this.warriorConstructor({
    //     name: 'Feit. Belemor',
    //     attr: { defesa: 9, ataque: 12, sabedoria: 15 },
    //     progress_attr: { vida: 9, modificador_vida: '' },
    //     note: ''
    //   }, 'npc'),
    // ])
    //#endregion LOAD WARRIORS

    const recursiveAutosave = () => {
      console.log('[verify-auto-save]');
      if(document.visibilityState === 'visible' && this.verifyPayloadAndSave()){
        this.game.is_auto_saved = true;

        setTimeout(() => this.game.is_auto_saved = false, 2.5 * 1000);
      }

      setTimeout(recursiveAutosave, 5 * 1000)
    }
    setTimeout(recursiveAutosave, 5 * 1000);
  },
  methods: {
    /** type = 'main' | 'player' | 'npc' */
    warriorConstructor: function (warrior, type){
      let parsed = {}
      if(type === 'npc'){
        let outherAttrs = {};
        if(warrior?.attr) Object.entries(warrior?.attr).forEach(
          ([key, value]) => outherAttrs[key] = Number(value ?? 0)
        );
        
        parsed = {
          name: warrior.name,
          attr: {
            ataque: Number(warrior?.attr?.ataque ?? 0),
            defesa: Number(warrior?.attr?.defesa ?? 0),
            ...outherAttrs
          },
          progress_attr: {
            vida: Number(warrior?.progress_attr?.vida ?? 0),
            modificador_vida: warrior?.progress_attr?.modificador_vida ?? '',
          },
          type,
          calculeds: {
            life: [0, '-/-', 0],
            sanity: [0, '-/-', 0]
          },
          note: warrior.note ?? ''
        };
      }
      else parsed = {
        name: warrior.bio.nome,
        attr: {
          defesa: warrior.atributos.defesa + warrior.atributos.modificador_defesa,
          forca: warrior.atributos.forca + warrior.atributos.modificador_forca,
          agilidade: warrior.atributos.agilidade + warrior.atributos.modificador_agilidade,
          saude: warrior.atributos.saude + warrior.atributos.modificador_saude,
          inteligencia: warrior.atributos.inteligencia + warrior.atributos.modificador_inteligencia,
          sabedoria: warrior.atributos.sabedoria + warrior.atributos.modificador_sabedoria,
          personalidade: warrior.atributos.personalidade + warrior.atributos.modificador_personalidade,
        },
        progress_attr: {
          sanidade: warrior.atributos.sanidade,
          modificador_sanidade: warrior.atributos.modificador_sanidade,
          vida: warrior.atributos.vida,
          modificador_vida: warrior.atributos.modificador_vida,
        },
        calculeds: {
          life: [0, '-/-', 0],
          sanity: [0, '-/-', 0]
        },
        type,
        note: warrior.notas
      }
    
      this.calculateDamages('modificador_vida', parsed);
      if(type !== 'npc') this.calculateDamages('modificador_sanidade', parsed);
    
      return parsed;
    },
    openModal: function (modal){
      if(!availableModals.includes(modal)){
        console.error(`[invalid-modal-to-open:${modal}]`)
        return;
      }

      if(modal === 'warriors') this.game.json_warriors = JSON.stringify(
        this.warriors.filter((war) => war.type !== 'main'), undefined, 2
      );
      
      this.game.modal[`is_open_${modal}`] = true;
    },
    closeModal: function (modal){
      if(!availableModals.includes(modal)){
        console.error(`[invalid-modal-to-close:${modal}]`)
        return;
      }

      this.game.modal[`is_open_${modal}`] = false;
    },
    openTestAttribute: function (attr, warrior){
      let value = '';
      if(attr === 'sanidade'){
        this.calculateDamages('modificador_sanidade', warrior)
        value = Number(warrior.calculeds.sanity[2]) ?? 0;
      }
      else value = Number(warrior.attr[attr] ?? 0);
      
      if(isNaN(value)) value = '';
      this.game.test_attribute.max = value;
      this.game.test_attribute.base = attr === 'sanidade' ? 100 : 20

      this.openModal('attributes');
    },
    updateWarriors: function (){
      let newWarriors = []
      try{
        newWarriors = JSON.parse(this.game.json_warriors ?? '[]').map(
          (war) => this.warriorConstructor(war, 'npc')
        );
      }catch(e){
        console.error(e);
        alert('Preenchimento inválido');
        return;
      }

      this.warriors = [
        ...this.warriors.filter(war => war.type !== 'npc'),
        ...newWarriors
      ];

      this.closeModal('warriors');
    },
    save: function (){
      const npcWarriors = [];
      this.warriors.forEach(warrior => {
        if(warrior.type === 'main'){
          const main = getPlayer();

          if(main) setPlayer({
            ...main,
            atributos: {
              ...main.atributos,
              defesa: warrior.attr.defesa - Number(main.atributos?.modificador_defesa ?? 0),
              forca: warrior.attr.forca - Number(main.atributos?.modificador_forca ?? 0),
              agilidade: warrior.attr.agilidade - Number(main.atributos?.modificador_agilidade ?? 0),
              saude: warrior.attr.saude - Number(main.atributos?.modificador_saude ?? 0),
              inteligencia: warrior.attr.inteligencia - Number(main.atributos?.modificador_inteligencia ?? 0),
              sabedoria: warrior.attr.sabedoria - Number(main.atributos?.modificador_sabedoria ?? 0),
              personalidade: warrior.attr.personalidade - Number(main.atributos?.modificador_personalidade ?? 0),
              sanidade: warrior.progress_attr.sanidade,
              modificador_sanidade: warrior.progress_attr.modificador_sanidade,
              vida: warrior.progress_attr.vida,
              modificador_vida: warrior.progress_attr.modificador_vida
            },
            notas: warrior.note
          })
        }
        else if(warrior.type === 'player') console.error('[ainda-não-há-tratamento-para-multiplos-players-em-batalha]');
        else npcWarriors.push(warrior);
      })

      setWarriors(npcWarriors);
    },
    verifyPayloadAndSave: function (){
      const storagedWarriors = [];
      const main = getMainPlayer();
      if(main) storagedWarriors.push(
        this.warriorConstructor(main, 'main')
      );
      storagedWarriors.push(...getWarriors() ?? []);

      if(JSON.stringify(storagedWarriors) === JSON.stringify(this.warriors)) return false;

      this.save();

      return true;
    },
    itsBetween: function (curr, range){
      if(!curr) return false;
      if(range[0] === '' || range[1] === '') return false;

      return curr >= range[0] && curr <= range[1]
    },
    calculateDamages: function (modifier, warrior){
      warrior.progress_attr[modifier] = warrior.progress_attr[modifier].replace(/[^+\-\d]|^[^\+\-]|(\+{2,})|(-{2,})|\+-|-\+/g, '')

      let refs = {
        modificador_vida:     { attr: 'vida',     calculateds: 'life'  },
        modificador_sanidade: { attr: 'sanidade', calculateds: 'sanity'}
      }
      
      let total = Number(warrior.progress_attr[refs[modifier].attr]);
      if(!warrior.progress_attr[refs[modifier].attr] || isNaN(total)) return;

      let curr = total;
      if(warrior.progress_attr[modifier]){
        try{
          curr = this.calculateStrOperations(total, warrior.progress_attr[modifier])
          if(isNaN(curr)) curr = undefined;
          else if(curr < 0) curr = 0;
        }catch(e){
          console.error('[calc-str-operation-error]', { e, total, modifier: [modifier, warrior.progress_attr[modifier]] })
          curr = undefined;
        }

        if(isNaN(curr)) curr = undefined
      }

      let percent = 100
      if(!isNaN(curr) && total  !== 0){
        if(curr === 0) percent = 0;
        else{
          percent = Math.round(curr * 100 / total)
          if(percent > 100) percent = 100
        }
      }

      warrior.calculeds[refs[modifier].calculateds] = [percent,`${curr ?? '-'}/${total}`, curr]
    },
    calculateStrOperations: function (initialValue, strOperation){
      let numbers = [];
      strOperation.replace(/[^+\-\d]/g, '').split(/[\+\-]/).forEach((n) => {
        if(n === '') return;
        numbers.push(Number(n));
      });
      let operators = strOperation.replace(/[0-9]/g, '');
      let result = initialValue;

      for (let i = 0; i < numbers.length; i++) {
        if (operators[i] === '+')  result += parseInt(numbers[i], 10);
        else if (operators[i] === '-') result -= parseInt(numbers[i], 10);
      }

      return result;
    }
  }
});