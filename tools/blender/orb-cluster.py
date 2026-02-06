import bpy
import bmesh
from pathlib import Path
from mathutils import Vector

OUTPUT_NAME = "model-3-orbcluster.glb"

bpy.ops.wm.read_factory_settings(use_empty=True)

def create_frame(name, width, height, frame, depth):
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    bm = bmesh.new()
    v1 = bm.verts.new((-width / 2, -height / 2, 0))
    v2 = bm.verts.new((width / 2, -height / 2, 0))
    v3 = bm.verts.new((width / 2, height / 2, 0))
    v4 = bm.verts.new((-width / 2, height / 2, 0))
    face = bm.faces.new((v1, v2, v3, v4))
    bm.faces.ensure_lookup_table()
    inset = bmesh.ops.inset_region(bm, faces=[face], thickness=frame, use_even_offset=True)
    inner_faces = inset["faces"]
    bmesh.ops.delete(bm, geom=inner_faces, context='FACES')
    bm.faces.ensure_lookup_table()
    faces = bm.faces[:]
    extruded = bmesh.ops.extrude_face_region(bm, geom=faces)
    verts = [ele for ele in extruded["geom"] if isinstance(ele, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=verts, vec=Vector((0, 0, depth)))
    bmesh.ops.translate(bm, verts=bm.verts, vec=Vector((0, 0, -depth / 2)))
    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    return obj

frames = []
depth = 0.06
base_width = 3.2
base_height = 2.1

for i in range(6):
    width = base_width - i * 0.32
    height = base_height - i * 0.22
    frame = 0.08 + i * 0.008
    obj = create_frame(f"ArtboardFrame_{i}", width, height, frame, depth)
    obj.location = (0.06 * i, -0.04 * i, i * 0.07)
    obj.rotation_euler = (0.02 * i, 0.1 * i, -0.04 * i)
    frames.append(obj)

bpy.ops.object.select_all(action='DESELECT')
for obj in frames:
    obj.select_set(True)

bpy.context.view_layer.objects.active = frames[0]
bpy.ops.object.join()
joined = bpy.context.active_object

bevel = joined.modifiers.new(name="Bevel", type='BEVEL')
bevel.width = 0.02
bevel.segments = 2
bpy.context.view_layer.objects.active = joined
bpy.ops.object.modifier_apply(modifier=bevel.name)

bpy.ops.object.shade_smooth()

bpy.ops.object.select_all(action='DESELECT')
joined.select_set(True)

root = Path(__file__).resolve().parents[2]
output_path = root / "public" / "models" / OUTPUT_NAME

bpy.ops.export_scene.gltf(
    filepath=str(output_path),
    export_format='GLB',
    export_apply=True,
    use_selection=True,
    export_yup=True
)
