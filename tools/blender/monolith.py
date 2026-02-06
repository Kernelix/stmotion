import bpy
import bmesh
import math
from pathlib import Path

OUTPUT_NAME = "model-1-monolith.glb"

bpy.ops.wm.read_factory_settings(use_empty=True)

bpy.ops.mesh.primitive_plane_add(size=3.2)
obj = bpy.context.active_object
obj.name = "FoldedSheet"

mesh = obj.data
bm = bmesh.new()
bm.from_mesh(mesh)

bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=6, use_grid_fill=True)

angle_a = math.radians(38)
angle_b = math.radians(-24)
fold_x = 0.4

for v in bm.verts:
    if v.co.y > 0:
        y = v.co.y
        z = v.co.z
        v.co.y = y * math.cos(angle_a) - z * math.sin(angle_a)
        v.co.z = y * math.sin(angle_a) + z * math.cos(angle_a)
    if v.co.x > fold_x:
        x = v.co.x - fold_x
        z = v.co.z
        v.co.x = x * math.cos(angle_b) + z * math.sin(angle_b) + fold_x
        v.co.z = -x * math.sin(angle_b) + z * math.cos(angle_b)

bm.to_mesh(mesh)
bm.free()

solidify = obj.modifiers.new(name="Solidify", type='SOLIDIFY')
solidify.thickness = 0.08

bevel = obj.modifiers.new(name="Bevel", type='BEVEL')
bevel.width = 0.02
bevel.segments = 2

bpy.context.view_layer.objects.active = obj
bpy.ops.object.modifier_apply(modifier=solidify.name)
bpy.ops.object.modifier_apply(modifier=bevel.name)

bpy.ops.object.shade_smooth()

bpy.ops.object.select_all(action='DESELECT')
obj.select_set(True)

root = Path(__file__).resolve().parents[2]
output_path = root / "public" / "models" / OUTPUT_NAME

bpy.ops.export_scene.gltf(
    filepath=str(output_path),
    export_format='GLB',
    export_apply=True,
    use_selection=True,
    export_yup=True
)
