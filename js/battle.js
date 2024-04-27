const storageBattle = 'rpg@battle'

const getMainPlayer = () => {
  const main = getPlayer();
  
  if(!main)  return;

  const parsed = playerConstructor(main)
  
  if(!parsed.bio.nome) return;

  return parsed;
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
    }
  },
  mounted() {
    //#region LOAD WARRIORS
    const main = getMainPlayer();

    if(main) this.warriors.push(
      this.warriorConstructor(main, 'main')
    );
    
    this.warriors.push(...[
      this.warriorConstructor({
        name: 'Mago Abbados',
        attr: { ataque: 8, defesa: 9, sabedoria: 15 },
        progress_attr: { vida: 14, modificador_vida: '' },
        note: ''
      }, 'npc'),
      this.warriorConstructor({
        name: 'Varogue I',
        attr: { defesa: 13, ataque: 15 },
        progress_attr: { vida: 24, modificador_vida: '' },
        note: 'Dano 1d6 + 2'
      }, 'npc'),
      this.warriorConstructor({
        name: 'Varogue II',
        attr: { defesa: 13, ataque: 15 },
        progress_attr: { vida: 24, modificador_vida: '' },
        note: 'Dano 1d6 + 2'
      }, 'npc'),
      this.warriorConstructor({
        name: 'Nebelor',
        attr: { defesa: 12, ataque: 13 },
        progress_attr: { vida: 18, modificador_vida: '' },
        note: ''
      }, 'npc'),
      this.warriorConstructor({
        name: 'Serpente Gigante',
        attr: { defesa: 15, ataque: 16 },
        progress_attr: { vida: 28, modificador_vida: '' },
        note: ''
      }, 'npc'),
      this.warriorConstructor({
        name: 'Feit. Bhur',
        attr: { defesa: 13, ataque: 6, sabedoria: 15 },
        progress_attr: { vida: 13, modificador_vida: '' },
        note: ''
      }, 'npc'),
      this.warriorConstructor({
        name: 'Feit. Belemor',
        attr: { defesa: 9, ataque: 12, sabedoria: 15 },
        progress_attr: { vida: 9, modificador_vida: '' },
        note: ''
      }, 'npc'),
    ])

    console.log({
      warriors: this.warriors, main
    })
    //#endregion LOAD WARRIORS

    // const recursiveAutosave = () => {
    //   console.log('[verify-auto-save]');
    //   if(this.verifyPayloadAndSave()){
    //     this.game.is_auto_saved = true;

    //     setTimeout(() => this.game.is_auto_saved = false, 2.5 * 1000);
    //   }

    //   setTimeout(recursiveAutosave, 5 * 1000)
    // }
    // setTimeout(recursiveAutosave, 5 * 1000);
  },
  methods: {
    /**
     * type = 'main' | 'player' | 'npc'
     * 
     */
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
            life: [100, '10/10'],
            sanity: [100, '100/100']
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
          life: [100, '10/10'],
          sanity: [100, '100/100']
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

      this.game.modal[`is_open_${modal}`] = true;
    },
    closeModal: function (modal){
      if(!availableModals.includes(modal)){
        console.error(`[invalid-modal-to-close:${modal}]`)
        return;
      }

      this.game.modal[`is_open_${modal}`] = false;
    },
    onDetails: function(modal, value){
      if(modal === 'abilities'){
        const findedAbility = this.game.abilities.find(({ name }) => name === value)
        if(!findedAbility){
          alert('Habilidade não encontrada');
          return;
        }

        this.game.details.title = findedAbility.name;
        this.game.details.description = findedAbility.description;
      }else
      if(modal === 'arms'){
        const findedArm = this.game.arms.find(({ name }) => name === value)
        if(!findedArm){
          alert('Arma não encontrada');
          return;
        }

        this.game.details.title = `${findedArm.name} | ${findedArm.value}`;
        this.game.details.description = findedArm.description;
      }

      this.openModal('details');
    },
    openTestAttribute: function (attr){
      let value = Number(this.atributos[attr] ?? 0);
      
      if(isNaN(value)) value = '';
      else if(!['sanidade', 'vida'].includes(attr) && this.atributos[`modificador_${attr}`]){
        const modifier = Number(this.atributos[`modificador_${attr}`]);
        if(!isNaN(modifier)) value+=modifier;
      }

      this.game.test_attribute.max = value;          
      this.game.test_attribute.base = attr === 'sanidade' ? 100 : 20

      this.openModal('attributes');
    },
    save: function (){
      
    },
    verifyPayloadAndSave: function (){
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

      warrior.calculeds[refs[modifier].calculateds] = [percent,`${curr ?? '-'}/${total}`]
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
    downloadCharacter: function (){
      const player = encodeURIComponent(JSON.stringify(getPlayer()));
      window.open(`https://api.whatsapp.com/send?text=${player}`, '_blank');
    },
    selectCharacter: function (player){
      if(player && this.bio.player === player) return;

      this.save();

      let selectedPlayer = player ? getPlayer(player) : undefined;
      const { bio, atributos, itens, notas } = playerConstructor(selectedPlayer);

      this.bio = bio;
      this.atributos = atributos;
      this.itens = itens;
      this.notas = notas;

      this.calculateDamages('modificador_vida');
      this.calculateDamages('modificador_sanidade');

      this.closeModal('alternate');
    },
    deleteCharacter: function (player){
      if(!window.confirm('Tem certeza que deseja excluir esse personagem?')) return;

      const all = getAllPlayers();
      const allPlayers = all.filter(p => p !== player);
      setAllPlayers(allPlayers);
      localStorage.removeItem(`${storageKey}:${player}`);

      this.game.allPlayers = allPlayers;
    },
    importChar: function (){
      if(!this.game.import){
        alert('É obrigatório preencher o campo de importação');
        return;
      }

      try{
        const importObject = JSON.parse(this.game.import);

        if(!importObject.bio || !importObject.atributos || !importObject.itens){
          alert('Importação inválida');
          return;
        }
        
        this.save();

        const { bio, atributos, itens, notas } = playerConstructor(importObject);

        this.bio = bio;
        this.atributos = atributos;
        this.itens = itens;
        this.notas = notas;

        this.calculateDamages('modificador_vida');
        this.calculateDamages('modificador_sanidade');

        this.closeModal('alternate');
      }catch(e){
        alert('Não foi possível importar')
        return;
      }
    }
  }
});