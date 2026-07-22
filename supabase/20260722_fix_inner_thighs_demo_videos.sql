-- Fix broken / wrong inner-thigh demo video URLs with verified YouTube embeds.

update public.gym_exercises as g set
  demo_video_url = v.demo_video_url,
  demo_thumbnail_url = v.demo_thumbnail_url
from (values
  ('hip-adductor',
   'https://www.youtube.com/embed/iYcS9jCA6gE',
   'https://img.youtube.com/vi/iYcS9jCA6gE/hqdefault.jpg'),
  ('side-lying-adduction',
   'https://www.youtube.com/embed/lhwT35sshrI',
   'https://img.youtube.com/vi/lhwT35sshrI/hqdefault.jpg'),
  ('sumo-squat',
   'https://www.youtube.com/embed/daK6R6Y6fcU',
   'https://img.youtube.com/vi/daK6R6Y6fcU/hqdefault.jpg'),
  ('cable-hip-adduction',
   'https://www.youtube.com/embed/SIQrpq6YnT8',
   'https://img.youtube.com/vi/SIQrpq6YnT8/hqdefault.jpg')
) as v(slug, demo_video_url, demo_thumbnail_url)
where g.slug = v.slug;
