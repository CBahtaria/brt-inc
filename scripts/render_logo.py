"""
BRT Inc. logo render
  flatpak run org.blender.Blender --background --python scripts/render_logo.py
Output: public/logo-render.png  (512x512, RGBA, transparent bg)

Camera convention: (0, 0, 8) looking along -Z.
All geometry lives in the XY plane (Z=0 baseline).
"""
import bpy, math, os

OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'public', 'logo-render.png'))
os.makedirs(os.path.dirname(OUT), exist_ok=True)

# ── Reset ──────────────────────────────────────────────────────────────────────
bpy.ops.wm.read_homefile(use_empty=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# ── Render ─────────────────────────────────────────────────────────────────────
sc = bpy.context.scene
sc.render.engine = 'CYCLES'
sc.cycles.device = 'CPU'
sc.cycles.samples = 512
sc.render.resolution_x = sc.render.resolution_y = 512
sc.render.resolution_percentage = 100
sc.render.film_transparent = True
sc.render.image_settings.file_format = 'PNG'
sc.render.image_settings.color_mode = 'RGBA'
sc.render.filepath = OUT

# ── World ──────────────────────────────────────────────────────────────────────
world = bpy.data.worlds.new('World')
sc.world = world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs[1].default_value = 0.0

# ── Camera — top-down along -Z ─────────────────────────────────────────────────
bpy.ops.object.camera_add(location=(0, 0, 8), rotation=(0, 0, 0))
cam = bpy.context.object
cam.data.type = 'ORTHO'
cam.data.ortho_scale = 6.0
sc.camera = cam

# ── Materials ──────────────────────────────────────────────────────────────────
def mat_emit(name, rgb, strength=6.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    e = nt.nodes.new('ShaderNodeEmission')
    e.inputs['Color'].default_value = (*rgb, 1)
    e.inputs['Strength'].default_value = strength
    o = nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(e.outputs[0], o.inputs[0])
    return m

def mat_pbr(name, rgb, metallic=0.95, rough=0.05, emit=1.2):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    p = nt.nodes.new('ShaderNodeBsdfPrincipled')
    p.inputs['Base Color'].default_value    = (*rgb, 1)
    p.inputs['Metallic'].default_value      = metallic
    p.inputs['Roughness'].default_value     = rough
    # Blender 4+ emission slots
    for slot in ('Emission Color', 'Emission'):
        if slot in p.inputs:
            p.inputs[slot].default_value = (*rgb, 1) if 'Color' in slot else emit
    if 'Emission Strength' in p.inputs:
        p.inputs['Emission Strength'].default_value = emit
    o = nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(p.outputs[0], o.inputs[0])
    return m

WHITE  = mat_pbr('White',  (0.95, 0.97, 1.00), metallic=0.3, rough=0.1, emit=3.5)
INDIGO = mat_emit('Indigo', (0.39, 0.40, 0.95), strength=8.0)
TEAL   = mat_emit('Teal',  (0.18, 0.83, 0.75), strength=6.0)

# ── BRT text (XY plane, face toward +Z = toward camera) ──────────────────────
bpy.ops.object.text_add(location=(-0.05, 0.45, 0))
brt = bpy.context.object
brt.data.body           = 'BRT'
brt.data.align_x        = 'CENTER'
brt.data.size           = 1.5
brt.data.extrude        = 0.12
brt.data.bevel_depth    = 0.02
brt.data.bevel_resolution = 3
brt.data.materials.append(INDIGO)

# ── INC. subtitle ─────────────────────────────────────────────────────────────
bpy.ops.object.text_add(location=(-0.05, -0.78, 0))
inc = bpy.context.object
inc.data.body           = 'INC.'
inc.data.align_x        = 'CENTER'
inc.data.size           = 0.48
inc.data.extrude        = 0.05
inc.data.bevel_depth    = 0.008
inc.data.space_character = 1.6
inc.data.materials.append(INDIGO)

# ── Thin divider bar in XY plane ──────────────────────────────────────────────
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -0.05, -0.02))
div = bpy.context.object
div.scale = (1.55, 0.018, 1)
bpy.ops.object.transform_apply(scale=True)
div.active_material = TEAL

# ── Hexagon ring in XY plane ──────────────────────────────────────────────────
bpy.ops.mesh.primitive_circle_add(vertices=6, radius=2.4, fill_type='NOTHING',
    location=(0, -0.05, -0.02), rotation=(0, 0, math.radians(30)))
ring = bpy.context.object
sol = ring.modifiers.new('Sol', 'SOLIDIFY')
sol.thickness = 0.05
ring.active_material = TEAL

# ── Vertex dots (in XY plane at z≈0) ─────────────────────────────────────────
for i in range(6):
    a = math.radians(i * 60 + 30)
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.1, segments=12, ring_count=8,
        location=(2.4 * math.cos(a), 2.4 * math.sin(a) - 0.05, 0)
    )
    bpy.context.object.active_material = TEAL

# ── Lights ─────────────────────────────────────────────────────────────────────
# Key — indigo from upper-left, pointing down
bpy.ops.object.light_add(type='AREA', location=(-3, -2, 5))
kl = bpy.context.object
kl.data.energy = 300; kl.data.size = 5
kl.data.color  = (0.5, 0.5, 1.0)
kl.rotation_euler = (math.radians(-60), 0, math.radians(-30))

# Fill — teal from right
bpy.ops.object.light_add(type='AREA', location=(4, 1, 4))
fl = bpy.context.object
fl.data.energy = 150; fl.data.size = 4
fl.data.color  = (0.15, 0.9, 0.8)
fl.rotation_euler = (math.radians(-45), 0, math.radians(60))

# Rim — warm white, slight back-light
bpy.ops.object.light_add(type='POINT', location=(0, 3, 2))
rl = bpy.context.object
rl.data.energy = 50; rl.data.color = (1, 0.95, 0.9)

# ── Render ─────────────────────────────────────────────────────────────────────
bpy.ops.render.render(write_still=True)
print(f'[DONE] {OUT}')
