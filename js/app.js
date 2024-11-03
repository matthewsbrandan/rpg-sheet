const availableModals = ['abilities', 'equipaments', 'arms', 'attributes', 'books', 'maps', 'alternate', 'details'];
const app = new Vue({
  el: '#app',
  data: {
    ...playerConstructor(initialPlayer),
    game: {
      is_auto_saved: false,
      modal: {
        is_open_abilities: false,
        is_open_equipaments: false,
        is_open_arms: false,
        is_open_attributes: false,
        is_open_books: false,
        is_open_maps: false,
        is_open_alternate: false,
        is_open_details: false
      },
      calculeds: {
        sanity: [0, '-/-', 0],
        life: [0, '-/-', 0]
      },
      abilities,
      arms,
      equipaments,
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
      maps: {  current: './map.jpg'    },
      details: { title: 'Detalhes', description: '' },
      allPlayers: [],
      characters,
      import: ''
    }
  },
  mounted() {
    const recursiveAutosave = () => {
      console.log('[verify-auto-save]');
      if(this.verifyPayloadAndSave()){
        this.game.is_auto_saved = true;

        setTimeout(() => this.game.is_auto_saved = false, 2.5 * 1000);
      }

      setTimeout(recursiveAutosave, 5 * 1000)
    }
    setTimeout(recursiveAutosave, 5 * 1000);

    this.calculateDamages('modificador_vida');
    this.calculateDamages('modificador_sanidade');

    this.game.allPlayers = getAllPlayers();
  },
  methods: {
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
      
      if(attr === 'sanidade'){
        this.calculateDamages('modificador_sanidade')
        value = Number(this.game.calculeds.sanity[2]) ?? 0;
      }else if(attr !== 'vida' && this.atributos[`modificador_${attr}`]){
        const modifier = Number(this.atributos[`modificador_${attr}`]);
        if(!isNaN(modifier)) value+=modifier;
      }

      if(isNaN(value)) value = '';

      this.game.test_attribute.max = value;          
      this.game.test_attribute.base = attr === 'sanidade' ? 100 : 20

      this.openModal('attributes');
    },
    save: function (){
      const player = {
        bio: this.bio,
        atributos: this.atributos,
        itens: this.itens,
        notas: this.notas
      }

      setPlayer(player)
    },
    verifyPayloadAndSave: function (){
      const storagedPlayer = getPlayer();

      const player = { bio: this.bio, atributos: this.atributos, itens: this.itens, notas: this.notas };

      if(JSON.stringify(storagedPlayer) === JSON.stringify(player)) return false;

      this.save();

      return true;
    },
    updateAbility: function (el){
      const isChecked = el.checked;
      const value = el.value;

      if(!this.atributos.habilidades) this.atributos.habilidades = [];
      
      if(isChecked){
        if(!this.atributos.habilidades.includes(value)) this.atributos.habilidades.push(
          value
        )
      }
      else this.atributos.habilidades = this.atributos.habilidades.filter(
        (ab) => ab !== value
      )
    },
    updateEquipament: function (el){
      const isChecked = el.checked;
      const value = el.value;

      if(!this.itens.equipamentos) this.itens.equipamentos = [];
      
      if(isChecked){
        if(!this.itens.equipamentos.includes(value)) this.itens.equipamentos.push(
          value
        );
      }
      else this.itens.equipamentos = this.itens.equipamentos.filter(
        (ab) => ab !== value
      );
    },
    updateArm: function (el){
      const isChecked = el.checked;
      const value = el.value;

      if(!this.itens.armas) this.itens.armas = [];
      
      const finded = this.game.arms.find((arm) => arm.name === value);
      if(!finded) return;
      
      if(isChecked){
        if(!this.itens.armas.some((arm) => arm.name === name)) this.itens.armas.push({
          name: value,
          value: finded.value
        });
      }
      else this.itens.armas = this.itens.armas.filter(
        (arm) => arm.name !== value
      )
    },
    itsBetween: function (curr, range){
      if(!curr) return false;
      if(range[0] === '' || range[1] === '') return false;

      return curr >= range[0] && curr <= range[1]
    },
    calculateDamages: function (modifier){
      this.atributos[modifier] = this.atributos[modifier].replace(/[^+\-\d]|^[^\+\-]|(\+{2,})|(-{2,})|\+-|-\+/g, '')

      let refs = {
        modificador_vida:   { attr: 'vida',   calculateds: 'life'   },
        modificador_sanidade: { attr: 'sanidade', calculateds: 'sanity'}
      }
      
      let total = Number(this.atributos[refs[modifier].attr]);
      if(!this.atributos[refs[modifier].attr] || isNaN(total)) return;

      let curr = total;
      if(this.atributos[modifier]){
        try{
          curr = this.calculateStrOperations(total, this.atributos[modifier])
          if(isNaN(curr)) curr = undefined;
          else if(curr < 0) curr = 0;
        }catch(e){
          console.error('[calc-str-operation-error]', { e, total, modifier: [modifier, this.atributos[modifier]] })
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

      this.game.calculeds[refs[modifier].calculateds] = [percent,`${curr ?? '-'}/${total}`, curr]
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
    selectDefaultCharacter: function (player){
      const all = getAllPlayers();
      let nome = all && all.find((char) => char === player.bio.nome) ? (
        `${player.bio.nome} (Cópia)`        
      ):player.bio.nome;
      
      this.save();

      const { bio, atributos, itens, notas } = playerConstructor(player);

      this.bio = { ...bio, nome };
      this.atributos = atributos;
      this.itens = itens;
      this.notas = notas;

      this.calculateDamages('modificador_vida');
      this.calculateDamages('modificador_sanidade');

      this.closeModal('alternate');

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