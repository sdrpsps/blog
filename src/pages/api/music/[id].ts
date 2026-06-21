import type { APIRoute } from 'astro';

export const prerender = false;

interface NetEaseMusicArtist {
  name: string;
  id: number;
}

interface NetEaseMusicAlbum {
  name: string;
  id: number;
  picUrl: string;
}

interface NetEaseMusicSong {
  name?: string;
  id: number;
  artists?: NetEaseMusicArtist[];
  album?: NetEaseMusicAlbum;
  ar?: Array<{ id: number; name: string }>;
  al?: {
    id: number;
    name: string;
    picUrl: string;
  };
}

interface NetEaseMusicResponse {
  songs: NetEaseMusicSong[];
  code: number;
}

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id || !/^\d+$/.test(id)) {
    return new Response(
      JSON.stringify({ error: "Invalid music ID" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const apiUrl = `https://music.163.com/api/song/detail/?id=${id}&ids=[${id}]`;
    
    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://music.163.com/",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch music info: ${response.statusText}`);
    }

    const data: NetEaseMusicResponse = await response.json();

    if (data.code !== 200 || !data.songs || data.songs.length === 0) {
      return new Response(
        JSON.stringify({ error: "Song not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const song = data.songs[0];
    
    let artists = "未知歌手";
    if (song.artists && song.artists.length > 0) {
      artists = song.artists.map((artist) => artist.name).join(" / ");
    } else if (song.ar && song.ar.length > 0) {
      artists = song.ar.map((artist) => artist.name).join(" / ");
    }

    let cover = "";
    let album = "未知专辑";
    if (song.album) {
      cover = song.album.picUrl || "";
      album = song.album.name || "未知专辑";
    } else if (song.al) {
      cover = song.al.picUrl || "";
      album = song.al.name || "未知专辑";
    }

    const title = song.name || "未知歌曲";
    const playUrl = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;

    return new Response(
      JSON.stringify({
        id: song.id,
        title,
        artist: artists,
        cover,
        album,
        playUrl,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          // 设置 CDN 缓存 24 小时以降低请求压力
          "Cache-Control": "public, max-age=86400",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching music info:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch music information" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
