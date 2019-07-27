import * as THREE from 'three'

import Loader from './Utils/Loader.js'
import EventEmitter from './Utils/EventEmitter.js'

import matcapBuildingSource from '../models/matcaps/building.png'
import matcapRockSource from '../models/matcaps/rock.png'

import staticDemoFloorShadowSource from '../models/staticDemo/floor-shadow.png'
import staticDemoBaseSource from '../models/staticDemo/base.glb'
import staticDemoCollisionSource from '../models/staticDemo/collision.glb'

import dynamicDemoBaseSource from '../models/dynamicDemo/base.glb'
import dynamicDemoCollisionSource from '../models/dynamicDemo/collision.glb'

export default class Resources extends EventEmitter
{
    constructor()
    {
        super()

        this.loader = new Loader()
        this.items = {}

        this.loader.load([
            { name: 'matcapBuilding', source: matcapBuildingSource },
            { name: 'matcapRock', source: matcapRockSource },

            { name: 'staticDemoBase', source: staticDemoBaseSource },
            { name: 'staticDemoCollision', source: staticDemoCollisionSource },
            { name: 'staticDemoFloorShadow', source: staticDemoFloorShadowSource },

            { name: 'dynamicDemoBase', source: dynamicDemoBaseSource },
            { name: 'dynamicDemoCollision', source: dynamicDemoCollisionSource }
        ])

        this.loader.on('fileEnd', (_resource, _data) =>
        {
            this.items[_resource.name] = _data
        })

        this.loader.on('end', () =>
        {
            // Create textures
            this.items.matcapBuildingTexture = new THREE.Texture(this.items.matcapBuilding)
            this.items.matcapBuildingTexture.needsUpdate = true

            this.items.matcapRockTexture = new THREE.Texture(this.items.matcapRock)
            this.items.matcapRockTexture.needsUpdate = true

            this.items.staticDemoFloorShadowTexture = new THREE.Texture(this.items.staticDemoFloorShadow)
            this.items.staticDemoFloorShadowTexture.needsUpdate = true

            // Objects
            this.items.objects = [
                {
                    type: 'static',
                    base: this.items.staticDemoBase.scene,
                    collision: this.items.staticDemoCollision.scene,
                    floorShadowTexture: this.items.staticDemoFloorShadowTexture,
                    offset: new THREE.Vector3(0, 0, 0),
                    mass: 0
                },
                {
                    type: 'dynamic',
                    base: this.items.dynamicDemoBase.scene,
                    collision: this.items.dynamicDemoCollision.scene,
                    offset: new THREE.Vector3(0, 0, 0),
                    mass: 2
                }
            ]

            this.trigger('ready')
        })
    }
}
