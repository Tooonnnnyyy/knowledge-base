import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { KnowledgeGraph3D } from '../src/graph-3d.js'

// These checks use Three's projection and CPU raycaster only. They do not
// create a WebGL context or establish browser rendering/visual correctness.
function fixture(nodes) {
  const graph = Object.create(KnowledgeGraph3D.prototype)
  graph.width = 1000
  graph.height = 800
  graph.overviewRadius = 1000
  graph.radius = 1000
  graph.yaw = 0
  graph.pitch = 0
  graph.target = new THREE.Vector3()
  graph.camera = new THREE.PerspectiveCamera(45, graph.width / graph.height, 1, 12000)
  graph.raycaster = new THREE.Raycaster()
  graph.nodes = nodes
  graph.nodeMap = new Map(nodes.map((node) => [node.id, node]))
  graph.scene = new THREE.Scene()
  const geometry = new THREE.SphereGeometry(6, 12, 9)
  const material = new THREE.MeshBasicMaterial({ color: '#75a9ff' })
  graph.meshes = new Map(nodes.map((node) => {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.userData.nodeId = node.id
    mesh.position.set(node.x, node.y, node.z)
    graph.scene.add(mesh)
    return [node.id, mesh]
  }))
  graph.updateCamera()
  graph.scene.updateMatrixWorld(true)
  return { graph, dispose: () => { geometry.dispose(); material.dispose() } }
}

const overlappingNodes = [
  { id: 'rear', x: 0, y: 0, z: -200 },
  { id: 'front', x: 0, y: 0, z: 200 },
]

test('3D sphere picking selects the visible foreground node regardless of node order', () => {
  for (const nodes of [overlappingNodes, [...overlappingNodes].reverse()]) {
    const { graph, dispose } = fixture(nodes)
    try {
      graph.raycaster.setFromCamera(new THREE.Vector2(0, 0), graph.camera)
      const hits = graph.raycaster.intersectObjects([...graph.meshes.values()], false)
      assert.ok(hits.some((hit) => hit.object.userData.nodeId === 'rear'))
      assert.equal(hits[0].object.userData.nodeId, 'front')
      assert.equal(graph.nearestNodeAt({ x: 500, y: 400 }).id, 'front')
    } finally { dispose() }
  }
})

test('3D generous hit-target ties prefer the foreground when the pointer misses both spheres', () => {
  for (const nodes of [overlappingNodes, [...overlappingNodes].reverse()]) {
    const { graph, dispose } = fixture(nodes)
    try {
      const pointer = { x: 520, y: 400 }
      graph.raycaster.setFromCamera(new THREE.Vector2(pointer.x / graph.width * 2 - 1, 1 - pointer.y / graph.height * 2), graph.camera)
      assert.equal(graph.raycaster.intersectObjects([...graph.meshes.values()], false).length, 0)
      assert.equal(graph.nearestNodeAt(pointer, 25).id, 'front')
    } finally { dispose() }
  }
})

test('3D semantic depth scale remains unclamped while accessible display targets keep a minimum size', () => {
  const { graph, dispose } = fixture([])
  try {
    const distant = graph.project({ x: 0, y: 0, z: -6000 })
    assert.equal(distant.visible, true)
    assert.equal(distant.depth, 7000)
    assert.ok(distant.perspectiveScale < .75)
    assert.ok(Math.abs(distant.perspectiveScale - 1 / 7) < 1e-10)
    assert.equal(distant.scale, .84)
  } finally { dispose() }
})
