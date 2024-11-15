import { Config } from './types';
import { CONE_CONFIG, RAYS_CONFIG } from './config';
import { DragManager } from './drag';

const TRANSFORM_BASE = 'rotateZ(180deg) rotateY(167.5deg) rotateX(48.2deg)';

const createLineElement = (className: string, transform: string): HTMLElement => {
    const line = document.createElement('div');
    line.className = className;
    line.style.transform = transform;
    return line;
};

const createLines = (
    container: HTMLElement,
    config: Config,
    className: string,
    transformFn: (angle: number) => string
): void => {
    const fragment = document.createDocumentFragment();
    const angleStep = 360 / config.numberOfLines;
    
    Array.from({ length: config.numberOfLines }).forEach((_, i) => {
        const line = createLineElement(
            className,
            transformFn(i * angleStep)
        );
        fragment.appendChild(line);
    });
    
    container.appendChild(fragment);
};

const createConeLines = (container: HTMLElement, config: Config): void => {
    createLines(
        container,
        config,
        'line',
        (angle) => `rotateY(${angle}deg) rotateX(${config.angle}deg)`
    );
};

const createRays = (container: HTMLElement, config: Config): void => {
    createLines(
        container,
        config,
        'ray',
        (angle) => `rotateZ(90deg) rotateX(${angle}deg)`
    );
};
const initialize = (): void => {
    const scene = document.querySelector('.scene') as HTMLElement;
    const cone = document.getElementById('cone');
    const rays = document.getElementById('rays');
    const hitbox = scene?.querySelector('.hitbox') as HTMLElement;
    const header = document.querySelector('.header') as HTMLElement;

    if (!scene || !cone || !rays || !hitbox || !header) {
        console.error('Required elements not found');
        return;
    }

    createConeLines(cone, CONE_CONFIG);
    createRays(rays, RAYS_CONFIG);
    
    // Initialize drag functionality
    hitbox.style.cursor = 'grab';
    new DragManager(scene, hitbox, header);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}
