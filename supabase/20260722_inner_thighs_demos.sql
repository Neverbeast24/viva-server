-- Add inner thighs (adductor) demos + filter coverage.

insert into public.gym_exercises (
  slug, name, muscle_group, equipment, difficulty, duration_seconds,
  demo_video_url, demo_thumbnail_url, cues
) values
  ('hip-adductor', 'Hip adductor machine', 'inner_thighs', 'machine', 'beginner', 40,
   'https://www.youtube.com/embed/iYcS9jCA6gE', 'https://img.youtube.com/vi/iYcS9jCA6gE/hqdefault.jpg',
   'Squeeze pads together with control; keep upright posture and avoid leaning.'),
  ('side-lying-adduction', 'Side-lying hip adduction', 'inner_thighs', 'bodyweight', 'beginner', 40,
   'https://www.youtube.com/embed/lhwT35sshrI', 'https://img.youtube.com/vi/lhwT35sshrI/hqdefault.jpg',
   'Bottom leg lifts slowly toward the ceiling; keep hips stacked.'),
  ('sumo-squat', 'Sumo squat', 'inner_thighs', 'dumbbell', 'beginner', 45,
   'https://www.youtube.com/embed/daK6R6Y6fcU', 'https://img.youtube.com/vi/daK6R6Y6fcU/hqdefault.jpg',
   'Wide stance, toes out, sit between the hips and drive through mid-foot.'),
  ('cable-hip-adduction', 'Cable hip adduction', 'inner_thighs', 'cable', 'intermediate', 40,
   'https://www.youtube.com/embed/SIQrpq6YnT8', 'https://img.youtube.com/vi/SIQrpq6YnT8/hqdefault.jpg',
   'Ankle cuff on the working leg; sweep across midline without rotating the hips.')
on conflict (slug) do update set
  name = excluded.name,
  muscle_group = excluded.muscle_group,
  equipment = excluded.equipment,
  difficulty = excluded.difficulty,
  duration_seconds = excluded.duration_seconds,
  demo_video_url = excluded.demo_video_url,
  demo_thumbnail_url = excluded.demo_thumbnail_url,
  cues = excluded.cues;
