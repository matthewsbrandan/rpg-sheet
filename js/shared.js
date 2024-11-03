const storageKey = 'rpg@player';
const storageAll = 'rpg@all-players';
let playerPayload = undefined;
const setPlayer = (player) => {
  playerPayload = JSON.stringify(player)
  localStorage.setItem(storageKey, playerPayload)

  if(player.bio?.nome){
    let name = player.bio.nome;
    localStorage.setItem(`${storageKey}:${name}`, playerPayload)
    const allPlayers = getAllPlayers();
    if(!allPlayers.includes(name)) setAllPlayers([
      ...allPlayers,
      name
    ]);
  }
}
const getPlayer = (name) => {
  const key = name ? `${storageKey}:${name}` : storageKey;
  const player = localStorage.getItem(key);
  try{ return JSON.parse(player); }
  catch(e){ return undefined; }
}
const getAllPlayers = () => {
  const allPlayers = localStorage.getItem(storageAll)
  if(!allPlayers) return [];
  return allPlayers.split(',').filter(p => !!p);
}
const setAllPlayers = (allPlayers) => localStorage.setItem(storageAll, allPlayers.join(','));

const initialPlayer = getPlayer();

const handlePartial = (initial, defaultValue, prop1, prop2) => {
  if(initial){
    if(prop1 && initial[prop1]){
      if(!prop2) return initial[prop1];
      else if(initial[prop1][prop2]) return initial[prop1][prop2];
    }
  }
  return defaultValue;
} 
const handlePartialNumber = (initial, defaultValue, prop1, prop2) => Number(
  handlePartial(initial, defaultValue, prop1, prop2) ?? 0
)
const playerConstructor = (initialPlayer) => ({
  bio: {
    nome: handlePartial(initialPlayer, '', 'bio', 'nome'),
    ocupacao: handlePartial(initialPlayer, '', 'bio', 'ocupacao'),
    origem : handlePartial(initialPlayer, '', 'bio', 'origem'),
  },
  atributos: {
    forca: handlePartialNumber(initialPlayer, 0, 'atributos', 'forca'),
    modificador_forca: handlePartialNumber(initialPlayer, 0, 'atributos', 'modificador_forca'),
    agilidade: handlePartialNumber(initialPlayer, 0, 'atributos', 'agilidade'),
    modificador_agilidade: handlePartialNumber(initialPlayer, 0, 'atributos', 'modificador_agilidade'),
    saude: handlePartialNumber(initialPlayer, 0, 'atributos', 'saude'),
    modificador_saude: handlePartialNumber(initialPlayer, 0, 'atributos', 'modificador_saude'),
    inteligencia: handlePartialNumber(initialPlayer, 0, 'atributos', 'inteligencia'),
    modificador_inteligencia: handlePartialNumber(initialPlayer, 0, 'atributos', 'modificador_inteligencia'),
    sabedoria: handlePartialNumber(initialPlayer, 0, 'atributos', 'sabedoria'),
    modificador_sabedoria: handlePartialNumber(initialPlayer, 0, 'atributos', 'modificador_sabedoria'),
    personalidade: handlePartialNumber(initialPlayer, 0, 'atributos', 'personalidade'),
    modificador_personalidade: handlePartialNumber(initialPlayer, 0, 'atributos', 'modificador_personalidade'),
    percepcao: handlePartialNumber(initialPlayer, 0, 'atributos', 'percepcao'),
    modificador_percepcao: handlePartialNumber(initialPlayer, 0, 'atributos', 'modificador_percepcao'),
    furtividade: handlePartialNumber(initialPlayer, 0, 'atributos', 'furtividade'),
    modificador_furtividade: handlePartialNumber(initialPlayer, 0, 'atributos', 'modificador_furtividade'),
    movimento: handlePartialNumber(initialPlayer, 0, 'atributos', 'movimento'),
    modificador_movimento: handlePartialNumber(initialPlayer, 0, 'atributos', 'modificador_movimento'),
    defesa: handlePartialNumber(initialPlayer, 0, 'atributos', 'defesa'),
    modificador_defesa: handlePartialNumber(initialPlayer, 0, 'atributos', 'modificador_defesa'),
    sanidade: handlePartialNumber(initialPlayer, 0, 'atributos', 'sanidade'),
    modificador_sanidade: handlePartial(initialPlayer, '', 'atributos', 'modificador_sanidade'),
    vida: handlePartialNumber(initialPlayer, 0, 'atributos', 'vida'),
    modificador_vida: handlePartial(initialPlayer, '', 'atributos', 'modificador_vida'),
    habilidades: handlePartial(initialPlayer, [], 'atributos', 'habilidades')
  },
  itens: {
    equipamentos: handlePartial(initialPlayer, [], 'itens', 'equipamentos'),
    armas: handlePartial(initialPlayer, [], 'itens', 'armas'),
    tesouros: initialPlayer?.itens?.tesouros && initialPlayer.itens.tesouros.length > 0 ? initialPlayer.itens.tesouros : ['']
  },
  notas: initialPlayer?.notas ?? '',
});