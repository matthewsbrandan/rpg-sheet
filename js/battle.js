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
      characters: characters,
      npcs,
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
          let minOne = (num) => num < 1 ? 1 : num
          let points = 20 - i;
          
          let twentyPercent = Math.round(points * .2); 
          let fortyPercent = Math.round(points * .4);
          const invalidRange = ['','']

          let extreme = twentyPercent === 0 ? invalidRange : [minOne(21 - twentyPercent), 20];
          let good = fortyPercent === 0 || twentyPercent === 0 ? invalidRange : [minOne(Number(extreme[0]) - fortyPercent), minOne(Number(extreme[0]) - 1)];
          let regular = [minOne(20 - points), fortyPercent <= 0 || twentyPercent <= 0 ? 20 : minOne(good[0] - 1)];

          let rest = 20 - points;

          let fiftyPercent = rest <= 0 ? 0 : Math.round(rest * .5);

          let bad = rest <= 0 || regular[0] === 20 ? invalidRange : (
            (regular[0] - fiftyPercent < 1 && regular[0] - 1 < 1) ? invalidRange : [minOne(regular[0] - fiftyPercent), minOne(regular[0] - 1)]
          );
          let terrible = rest <= 0 || bad[0] - 1 < 1 ? invalidRange : [1, minOne(bad[0] - 1)];
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
    warriorConstructor: function (warrior, type, suport = false){
      let parsed = {}
      if(type === 'npc' && !suport){
        let outherAttrs = {};
        if(warrior?.attr) Object.entries(warrior?.attr).forEach(
          ([key, value]) => outherAttrs[key] = Number(value ?? 0)
        );
        
        parsed = {
          name: warrior.name,
          attr: {
            defesa: Number(warrior?.attr?.defesa ?? 0),
            ...outherAttrs
          },
          progress_attr: {
            vida: Number(warrior?.progress_attr?.vida ?? 0),
            modificador_vida: warrior?.progress_attr?.modificador_vida ?? '',
            ...(warrior?.progress_attr?.sanidade ? {
              sanidade: Number(warrior.progress_attr.sanidade ?? 0),
              modificador_sanidade: warrior.progress_attr.modificador_sanidade ?? '',
            }:{})
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
          percepcao: warrior.atributos.percepcao + warrior.atributos.modificador_percepcao,
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
      if(parsed.progress_attr.sanidade !== undefined) this.calculateDamages('modificador_sanidade', parsed);
    
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
              percepcao: warrior.attr.percepcao - Number(main.atributos?.modificador_percepcao ?? 0),
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
    },
    selectDefaultCharacter: function (player, type){
      this.warriors.push(
        this.warriorConstructor(player, 'npc', type !== 'npc')
      );

      this.game.json_warriors = JSON.stringify(this.warriors, null, 2)
    },
    removeWarrior: function(warrior_name){
      this.warriors = this.warriors.filter((warrior,i) => i === 0 || warrior.name !== warrior_name)

      this.game.json_warriors = JSON.stringify(this.warriors, null, 2)
    }
  }
});