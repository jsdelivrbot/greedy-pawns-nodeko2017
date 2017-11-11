import { Render, Transform, Move, Light } from 'cervus/components';
import { Box } from 'cervus/shapes';
import { Entity } from 'cervus/core';

export class Player {
  constructor(options = {}) {
    this.colors = [
      'FF00FF',
      '810081'
    ];

    this.world = options.world;
    this.board = options.board;

    this.lastX = 0;
    this.lastY = 0;
    this.last_colored = '';

    this.entity = new Box();
    this.entity.add_component(new Move({
      keyboard_controlled: true,
      rotate_speed: 0
    }));

    this.components = {
      transform: this.entity.get_component(Transform),
      render: this.entity.get_component(Render),
      move: this.entity.get_component(Move)
    };

    this.components.render.material = this.world.material;
    this.components.render.color = this.colors[0];
    this.components.transform.position = [0, 0, 3];
    this.world.game.add(this.entity);

    this.light = new Entity({
      components: [
        new Transform(),
        new Light({
          color: this.colors[0],
          intensity: 0.01
        })
      ]
    });
    this.light_transform = this.light.get_component(Transform);

    this.world.game.add(this.light);
  }

  on_tick() {
    const position = this.components.transform.position;

    if (this.lastX === position[0]) {
      this.components.transform.position = [
        Math.round(position[0]),
        position[1],
        position[2]
      ];
    } else {
      this.lastX = position[0];
    }

    if (this.lastY === position[2]) {
      this.components.transform.position = [
        position[0],
        position[1],
        Math.round(position[2])
      ];
    } else {
      this.lastY = position[2];
    }

    this.light_transform.position = [
      position[0],
      position[1],
      position[2]
    ];

    const rounded_x = Math.round(position[0]);
    const rounded_y = Math.round(position[2]);
    if (this.last_colored !== rounded_x + '-' + rounded_y) {
      this.last_colored = rounded_x + '-' + rounded_y;
      this.board.color_square(
        rounded_x,
        rounded_y,
        this.colors[Math.abs((rounded_x + rounded_y)%2)]
      )
    }

  }
}
