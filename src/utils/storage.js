import buildSongs from '../data/songsData'
export const STORAGE_KEY = 'arc_songs_v2'


export function loadSongsFromLocal(){
try{
const raw = localStorage.getItem(STORAGE_KEY)
if(!raw) return buildSongs()
const parsed = JSON.parse(raw)
if(!Array.isArray(parsed) || parsed.length !== 60) return buildSongs()
return parsed
}catch(e){
return buildSongs()
}
}