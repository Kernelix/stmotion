import bpy
from pathlib import Path
from mathutils import Vector

OUTPUT_NAME = "model-2-ribbon.glb"
BEVEL_DEPTH = 0.09
BEVEL_RESOLUTION = 10

bpy.ops.wm.read_factory_settings(use_empty=True)

def create_curve(name, points, rotation):
    curve_data = bpy.data.curves.new(name, type='CURVE')
    curve_data.dimensions = '3D'
    curve_data.bevel_depth = BEVEL_DEPTH
    curve_data.bevel_resolution = BEVEL_RESOLUTION
    curve_data.resolution_u = 24
    curve_data.use_fill_caps = True

    spline = curve_data.splines.new('BEZIER')
    spline.bezier_points.add(len(points) - 1)
    for index, point in enumerate(points):
        bp = spline.bezier_points[index]
        bp.co = point
        bp.handle_left_type = 'AUTO'
        bp.handle_right_type = 'AUTO'
    spline.use_cyclic_u = True

    curve_object = bpy.data.objects.new(name, curve_data)
    curve_object.rotation_euler = rotation
    bpy.context.scene.collection.objects.link(curve_object)
    return curve_object

points_a = [
    Vector((1.4, 0.1, 0.0)),
    Vector((0.6, 0.9, 0.6)),
    Vector((-0.8, 0.6, 0.2)),
    Vector((-1.2, -0.2, -0.6)),
    Vector((-0.2, -0.9, -0.4)),
    Vector((1.0, -0.5, 0.4))
]

points_b = [
    Vector((0.2, 1.2, -0.6)),
    Vector((0.9, 0.5, -0.2)),
    Vector((0.6, -0.7, 0.6)),
    Vector((-0.4, -1.1, 0.2)),
    Vector((-1.0, -0.3, -0.4)),
    Vector((-0.6, 0.8, 0.4))
]

curve_a = create_curve("BezierWeaveA", points_a, (0.1, 0.0, 0.1))
curve_b = create_curve("BezierWeaveB", points_b, (0.5, 0.8, -0.2))

depsgraph = bpy.context.evaluated_depsgraph_get()
mesh_objects = []
for curve_object in [curve_a, curve_b]:
    mesh_copy = bpy.data.meshes.new_from_object(curve_object.evaluated_get(depsgraph))
    mesh_object = bpy.data.objects.new(curve_object.name + "_mesh", mesh_copy)
    bpy.context.scene.collection.objects.link(mesh_object)
    mesh_objects.append(mesh_object)

for mesh_object in mesh_objects:
    for polygon in mesh_object.data.polygons:
        polygon.use_smooth = True

bpy.ops.object.select_all(action='DESELECT')
for mesh_object in mesh_objects:
    mesh_object.select_set(True)

bpy.context.view_layer.objects.active = mesh_objects[0]
bpy.ops.object.join()
joined = bpy.context.active_object

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
