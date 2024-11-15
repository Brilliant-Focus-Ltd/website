export class DragManager {
    private isDragging = false;
    private currentX = 50;
    private currentY = 50;
    private startX = 0;
    private startY = 0;

    constructor(
        private scene: HTMLElement,
        private hitbox: HTMLElement,
        private header: HTMLElement
    ) {
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.hitbox.addEventListener('mousedown', this.handleMouseDown);
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
        
        // Touch support
        this.hitbox.addEventListener('touchstart', this.handleTouchStart);
        document.addEventListener('touchmove', this.handleTouchMove);
        document.addEventListener('touchend', this.handleTouchEnd);
    }

    private handleMouseDown = (e: MouseEvent): void => {
        this.isDragging = true;
        const rect = this.header.getBoundingClientRect();
        this.startX = e.clientX - (rect.width * (this.currentX / 100));
        this.startY = e.clientY - (rect.height * (this.currentY / 100));
        this.hitbox.style.cursor = 'grabbing';
    };

    private handleMouseMove = (e: MouseEvent): void => {
        if (!this.isDragging) return;
        
        const rect = this.header.getBoundingClientRect();
        const x = e.clientX - this.startX;
        const y = e.clientY - this.startY;
        
        this.updatePosition(x, y, rect.width, rect.height);
    };

    private handleMouseUp = (): void => {
        this.isDragging = false;
        this.hitbox.style.cursor = 'grab';
    };

    private handleTouchStart = (e: TouchEvent): void => {
        if (e.touches.length !== 1) return;
        e.preventDefault();
        
        this.isDragging = true;
        const touch = e.touches[0];
        const rect = this.header.getBoundingClientRect();
        this.startX = touch.clientX - (rect.width * (this.currentX / 100));
        this.startY = touch.clientY - (rect.height * (this.currentY / 100));
    };

    private handleTouchMove = (e: TouchEvent): void => {
        if (!this.isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const rect = this.header.getBoundingClientRect();
        const x = touch.clientX - this.startX;
        const y = touch.clientY - this.startY;
        
        this.updatePosition(x, y, rect.width, rect.height);
    };

    private handleTouchEnd = (): void => {
        this.isDragging = false;
    };

    private updatePosition(x: number, y: number, containerWidth: number, containerHeight: number): void {
        // Convert to percentage (constrained between 0-100)
        this.currentX = Math.max(0, Math.min(100, (x / containerWidth) * 100));
        this.currentY = Math.max(0, Math.min(100, (y / containerHeight) * 100));
        
        // Update scene position
        this.scene.style.left = `${this.currentX}%`;
        this.scene.style.top = `${this.currentY}%`;
    }
}