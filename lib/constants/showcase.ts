// lib/constants/showcase.ts

export interface ShowcaseItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl: string;
  model: string;
  aspectRatio: string;
  creator: {
    name: string;
    avatar: string;
    handle: string;
  };
  prompt: string;
  cameraMovement?: string;
  duration?: string;
  category: string;
  likes: number;
}

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'sc-1',
    title: 'Cyberpunk Monolith in Neon Rain',
    type: 'video',
    mediaUrl: 'https://cdn.higgsfield.ai/card/16eebc9a-8310-4f68-8a02-1e2e6f109169.mp4',
    thumbnailUrl: 'https://static-public-media.higgsfield.ai/cards/e00fa340-fd99-47d6-ae8f-9bdd20f9393e.webp',
    model: 'Studio V1',
    aspectRatio: '16:9',
    creator: {
      name: 'Elena Rostova',
      handle: '@erostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    prompt: 'Cinematic drone tracking shot of an obsidian cyberpunk monolith towering above drenched Tokyo rooftops, electric lime holographic ads, volumetric rain reflections, 8k resolution octane render',
    cameraMovement: 'Drone Orbit 360',
    duration: '5s',
    category: 'Sci-Fi',
    likes: 1420,
  },
  {
    id: 'sc-2',
    title: 'Neo-Tokyo Streetwear Fashion Walk',
    type: 'video',
    mediaUrl: 'https://static-public-media.higgsfield.ai/cards/d6b970cb-8a24-41e6-8c83-023fd2ab585b.mp4',
    thumbnailUrl: 'https://static.higgsfield.ai/kling-4.0/explore-banner-v2/streetwear.webp',
    model: 'Swift V1',
    aspectRatio: '9:16',
    creator: {
      name: 'Kenji Sato',
      handle: '@kenjimotion',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    prompt: 'High fashion model in technical iridescent puffer coat stepping through Shibuya crossing, anamorphic lens flares, ultra-realistic slow motion stride, bokeh lights',
    cameraMovement: 'Tracking Dolly',
    duration: '5s',
    category: 'Fashion',
    likes: 980,
  },
  {
    id: 'sc-3',
    title: 'Seedance Dynamic Commercial Flow',
    type: 'video',
    mediaUrl: 'https://static-public-media.higgsfield.ai/cards/4c2bb5a7-ba39-464d-be1d-01de1c52dcaf.mp4',
    thumbnailUrl: 'https://static.higgsfield.ai/kling-4.0/explore-banner-v2/perfume.webp',
    model: 'Seedance 2.5',
    aspectRatio: '16:9',
    creator: {
      name: 'Atomic Studio',
      handle: '@atomic_official',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    },
    prompt: 'Liquid crystal fragrance bottle shattering into floating golden droplets, hyper-detailed macro photography, studio spotlight sweep, seamless physics',
    cameraMovement: 'Slow Push In',
    duration: '5s',
    category: 'Commercial',
    likes: 2150,
  },
  {
    id: 'sc-4',
    title: 'High Velocity Formula Race',
    type: 'video',
    mediaUrl: 'https://static-public-media.higgsfield.ai/cards/8dddb16b-6fe1-4cac-a11a-a650691a292d.mp4',
    thumbnailUrl: 'https://static.higgsfield.ai/kling-4.0/explore-banner-v2/football.webp',
    model: 'Range',
    aspectRatio: '21:9',
    creator: {
      name: 'Marcus Vane',
      handle: '@vane_fx',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    prompt: 'FPV racing drone diving alongside futuristic hover-racing prototype through canyon chicane, dust trail dynamics, motion blur, cinema soundstage',
    cameraMovement: 'FPV Rush',
    duration: '10s',
    category: 'Action',
    likes: 1840,
  },
  {
    id: 'sc-5',
    title: 'Bioluminescent Cybernetic Muse',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    model: 'Apex Vision (Default)',
    aspectRatio: '16:9',
    creator: {
      name: 'Aria Chen',
      handle: '@ariachen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    prompt: 'Hyper-detailed portrait of a synthetic cybernetic muse, glowing emerald eyes, intricate bioluminescent filigree, Hasselblad 100mm f/1.4, cinematic split lighting',
    category: 'Portraits',
    likes: 3120,
  },
  {
    id: 'sc-6',
    title: 'Nordic Cliffside Pavilion Sanctuary',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    model: 'Flux Pro Studio',
    aspectRatio: '16:9',
    creator: {
      name: 'Lars Nygard',
      handle: '@lars_arch',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    },
    prompt: 'Futuristic luxury architectural pavilion perched above misty Nordic fjords at twilight, floor-to-ceiling glass, architectural digest feature, warm tungsten interior glow',
    category: 'Architecture',
    likes: 1650,
  },
  {
    id: 'sc-7',
    title: 'Cosmic Nebula Explorer',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    model: 'Apex Vision (Default)',
    aspectRatio: '1:1',
    creator: {
      name: 'Gowshik Admin',
      handle: '@gowshik_apex',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    prompt: 'Deep space explorer suit drifting in front of iridescent stellar nursery nebula, golden hour starlight reflection on helmet visor, photorealistic',
    category: 'Sci-Fi',
    likes: 2490,
  },
  {
    id: 'sc-8',
    title: 'Hypercar Silhouette at Sunset',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
    model: 'Photoreal V3',
    aspectRatio: '16:9',
    creator: {
      name: 'Dario Silva',
      handle: '@dariosilva',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    },
    prompt: 'Matte black concept hypercar parked on salt flats during vivid orange and violet sunset, long exposure headlights trail, ultra crisp detail',
    category: 'Automotive',
    likes: 1890,
  },
];
