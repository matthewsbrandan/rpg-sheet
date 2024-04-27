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

const playerConstructor = (initialPlayer) => ({
  bio: {
    nome: initialPlayer?.bio?.nome ?? '',
    ocupacao: initialPlayer?.bio?.ocupacao ?? '',
    origem : initialPlayer?.bio?.origem ?? '',
  },
  atributos: {
    forca: Number(initialPlayer?.atributos?.forca ?? 0),
    modificador_forca: Number(initialPlayer?.atributos?.modificador_forca ?? 0),
    agilidade: Number(initialPlayer?.atributos?.agilidade ?? 0),
    modificador_agilidade: Number(initialPlayer?.atributos?.modificador_agilidade ?? 0),
    saude: Number(initialPlayer?.atributos?.saude ?? 0),
    modificador_saude: Number(initialPlayer?.atributos?.modificador_saude ?? 0),
    inteligencia: Number(initialPlayer?.atributos?.inteligencia ?? 0),
    modificador_inteligencia: Number(initialPlayer?.atributos?.modificador_inteligencia ?? 0),
    sabedoria: Number(initialPlayer?.atributos?.sabedoria ?? 0),
    modificador_sabedoria: Number(initialPlayer?.atributos?.modificador_sabedoria ?? 0),
    personalidade: Number(initialPlayer?.atributos?.personalidade ?? 0),
    modificador_personalidade: Number(initialPlayer?.atributos?.modificador_personalidade ?? 0),
    defesa: Number(initialPlayer?.atributos?.defesa ?? 0),
    modificador_defesa: Number(initialPlayer?.atributos?.modificador_defesa ?? 0),
    sanidade: Number(initialPlayer?.atributos?.sanidade ?? 0),
    modificador_sanidade: initialPlayer?.atributos?.modificador_sanidade ?? '',
    vida: Number(initialPlayer?.atributos?.vida ?? 0),
    modificador_vida: initialPlayer?.atributos?.modificador_vida ?? '',
    habilidades: initialPlayer?.atributos?.habilidades ?? []
  },
  itens: {
    equipamentos: initialPlayer?.itens?.equipamentos ?? [],
    armas: initialPlayer?.itens?.armas ?? [],
    tesouros: initialPlayer?.itens?.tesouros && initialPlayer.itens.tesouros.length > 0 ? initialPlayer.itens.tesouros : ['']
  },
  notas: initialPlayer?.notas ?? '',
});