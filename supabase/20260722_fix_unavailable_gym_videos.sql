-- Replace unavailable YouTube demo embeds with oEmbed-verified working videos.
-- Also refresh demo_thumbnail_url to match each new video id.

update public.gym_exercises as g
set
  demo_video_url = v.demo_video_url,
  demo_thumbnail_url = v.demo_thumbnail_url
from (
  values
    ('ab-crunch-machine', 'https://www.youtube.com/embed/9FGilxCbdz8', 'https://img.youtube.com/vi/9FGilxCbdz8/hqdefault.jpg'),
    ('ankle-rocks', 'https://www.youtube.com/embed/Gs4AyvJpG1M', 'https://img.youtube.com/vi/Gs4AyvJpG1M/hqdefault.jpg'),
    ('back-extension-machine', 'https://www.youtube.com/embed/4XLEnwUr1d8', 'https://img.youtube.com/vi/4XLEnwUr1d8/hqdefault.jpg'),
    ('bench-dip', 'https://www.youtube.com/embed/c3ZGl4pAwZ4', 'https://img.youtube.com/vi/c3ZGl4pAwZ4/hqdefault.jpg'),
    ('bird-dog', 'https://www.youtube.com/embed/4XLEnwUr1d8', 'https://img.youtube.com/vi/4XLEnwUr1d8/hqdefault.jpg'),
    ('box-jump', 'https://www.youtube.com/embed/wS4OsJ4yzx4', 'https://img.youtube.com/vi/wS4OsJ4yzx4/hqdefault.jpg'),
    ('cable-crunch', 'https://www.youtube.com/embed/9FGilxCbdz8', 'https://img.youtube.com/vi/9FGilxCbdz8/hqdefault.jpg'),
    ('cable-pull-through', 'https://www.youtube.com/embed/4AObAU-EcYE', 'https://img.youtube.com/vi/4AObAU-EcYE/hqdefault.jpg'),
    ('cable-woodchop', 'https://www.youtube.com/embed/ljgqer1ZpXg', 'https://img.youtube.com/vi/ljgqer1ZpXg/hqdefault.jpg'),
    ('clamshell', 'https://www.youtube.com/embed/OUgsJ8-Vi0E', 'https://img.youtube.com/vi/OUgsJ8-Vi0E/hqdefault.jpg'),
    ('dumbbell-step-up', 'https://www.youtube.com/embed/2C-uNgKwPLE', 'https://img.youtube.com/vi/2C-uNgKwPLE/hqdefault.jpg'),
    ('thruster', 'https://www.youtube.com/embed/qEwKCR5JCog', 'https://img.youtube.com/vi/qEwKCR5JCog/hqdefault.jpg'),
    ('farmer-carry', 'https://www.youtube.com/embed/Fkzk_RqlYig', 'https://img.youtube.com/vi/Fkzk_RqlYig/hqdefault.jpg'),
    ('farmers-hold', 'https://www.youtube.com/embed/Fkzk_RqlYig', 'https://img.youtube.com/vi/Fkzk_RqlYig/hqdefault.jpg'),
    ('fire-hydrant', 'https://www.youtube.com/embed/OUgsJ8-Vi0E', 'https://img.youtube.com/vi/OUgsJ8-Vi0E/hqdefault.jpg'),
    ('glute-kickback-machine', 'https://www.youtube.com/embed/SEdqd1n0cvg', 'https://img.youtube.com/vi/SEdqd1n0cvg/hqdefault.jpg'),
    ('good-morning', 'https://www.youtube.com/embed/FQKfr1YDhEk', 'https://img.youtube.com/vi/FQKfr1YDhEk/hqdefault.jpg'),
    ('high-knees', 'https://www.youtube.com/embed/iSSAk4XCsRA', 'https://img.youtube.com/vi/iSSAk4XCsRA/hqdefault.jpg'),
    ('incline-push-up', 'https://www.youtube.com/embed/IODxDxX7oi4', 'https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg'),
    ('jump-rope', 'https://www.youtube.com/embed/iSSAk4XCsRA', 'https://img.youtube.com/vi/iSSAk4XCsRA/hqdefault.jpg'),
    ('kettlebell-swing', 'https://www.youtube.com/embed/FQKfr1YDhEk', 'https://img.youtube.com/vi/FQKfr1YDhEk/hqdefault.jpg'),
    ('thoracic-rotation', 'https://www.youtube.com/embed/kqnua4rHVVA', 'https://img.youtube.com/vi/kqnua4rHVVA/hqdefault.jpg'),
    ('pike-push-up', 'https://www.youtube.com/embed/IODxDxX7oi4', 'https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg'),
    ('preacher-curl-machine', 'https://www.youtube.com/embed/ykJmrZ5v0Oo', 'https://img.youtube.com/vi/ykJmrZ5v0Oo/hqdefault.jpg'),
    ('rear-delt-fly-machine', 'https://www.youtube.com/embed/PpTFvRTYfpw', 'https://img.youtube.com/vi/PpTFvRTYfpw/hqdefault.jpg'),
    ('reverse-crunch', 'https://www.youtube.com/embed/9FGilxCbdz8', 'https://img.youtube.com/vi/9FGilxCbdz8/hqdefault.jpg'),
    ('reverse-wrist-curl', 'https://www.youtube.com/embed/ykJmrZ5v0Oo', 'https://img.youtube.com/vi/ykJmrZ5v0Oo/hqdefault.jpg'),
    ('rowing-machine', 'https://www.youtube.com/embed/GZbfZ033f74', 'https://img.youtube.com/vi/GZbfZ033f74/hqdefault.jpg'),
    ('ski-erg', 'https://www.youtube.com/embed/M4j_vJlfZvs', 'https://img.youtube.com/vi/M4j_vJlfZvs/hqdefault.jpg'),
    ('stair-climber', 'https://www.youtube.com/embed/M4j_vJlfZvs', 'https://img.youtube.com/vi/M4j_vJlfZvs/hqdefault.jpg'),
    ('standing-calf-raise', 'https://www.youtube.com/embed/JbyjNymZOt0', 'https://img.youtube.com/vi/JbyjNymZOt0/hqdefault.jpg'),
    ('superman-hold', 'https://www.youtube.com/embed/4XLEnwUr1d8', 'https://img.youtube.com/vi/4XLEnwUr1d8/hqdefault.jpg'),
    ('thread-the-needle', 'https://www.youtube.com/embed/kqnua4rHVVA', 'https://img.youtube.com/vi/kqnua4rHVVA/hqdefault.jpg'),
    ('tricep-extension-machine', 'https://www.youtube.com/embed/2-LAMcpzODU', 'https://img.youtube.com/vi/2-LAMcpzODU/hqdefault.jpg'),
    ('wall-sit', 'https://www.youtube.com/embed/aclHkVaku9U', 'https://img.youtube.com/vi/aclHkVaku9U/hqdefault.jpg'),
    ('worlds-greatest-stretch', 'https://www.youtube.com/embed/kqnua4rHVVA', 'https://img.youtube.com/vi/kqnua4rHVVA/hqdefault.jpg'),
    ('wrist-curl', 'https://www.youtube.com/embed/ykJmrZ5v0Oo', 'https://img.youtube.com/vi/ykJmrZ5v0Oo/hqdefault.jpg')
) as v(slug, demo_video_url, demo_thumbnail_url)
where g.slug = v.slug;
