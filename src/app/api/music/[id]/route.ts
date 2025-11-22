import { NextRequest, NextResponse } from "next/server";

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
  // 兼容旧版 API 格式
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

/**
 * 获取网易云音乐歌曲信息
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json(
      { error: "Invalid music ID" },
      { status: 400 }
    );
  }

  try {
    // 使用网易云音乐 API 获取歌曲详情
    const apiUrl = `https://music.163.com/api/song/detail/?id=${id}&ids=[${id}]`;
    
    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://music.163.com/",
      },
      next: {
        revalidate: 60 * 60 * 24, // 缓存 24 小时
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch music info: ${response.statusText}`);
    }

    const data: NetEaseMusicResponse = await response.json();

    if (data.code !== 200 || !data.songs || data.songs.length === 0) {
      return NextResponse.json(
        { error: "Song not found" },
        { status: 404 }
      );
    }

    const song = data.songs[0];
    
    // 安全地获取歌手信息（优先使用 artists，兼容 ar）
    let artists = "未知歌手";
    if (song.artists && song.artists.length > 0) {
      artists = song.artists.map((artist) => artist.name).join(" / ");
    } else if (song.ar && song.ar.length > 0) {
      artists = song.ar.map((artist) => artist.name).join(" / ");
    }

    // 安全地获取专辑信息（优先使用 album，兼容 al）
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

    // 获取播放链接
    const playUrl = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;

    return NextResponse.json({
      id: song.id,
      title,
      artist: artists,
      cover,
      album,
      playUrl,
    });
  } catch (error) {
    console.error("Error fetching music info:", error);
    return NextResponse.json(
      { error: "Failed to fetch music information" },
      { status: 500 }
    );
  }
}

