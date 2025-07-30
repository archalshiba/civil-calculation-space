import DxfWriter from 'dxf-writer-js';
import type { ScheduleItem, ReinforcementBar } from '../types';

// Helper function to draw a bar shape in the DXF file
function drawBarShape(writer: DxfWriter, item: ScheduleItem, startX: number, startY: number) {
    const SHAPE_WIDTH = 80;
    const SHAPE_HEIGHT = 60;
    const BEND_RADIUS = 5;

    writer.setCurrentLayer('GEOMETRY');

    switch (item.shapeCode) {
        case 'straight':
            writer.drawLine(startX, startY, startX + SHAPE_WIDTH, startY);
            break;
        case 'L-bend':
            writer.addLwpolyline([
                { x: startX, y: startY + SHAPE_HEIGHT },
                { x: startX, y: startY },
                { x: startX + SHAPE_WIDTH * 0.6, y: startY }
            ]);
            break;
        case 'stirrup':
            // Main body
            writer.addLwpolyline([
                { x: startX, y: startY + BEND_RADIUS },
                { x: startX, y: startY + SHAPE_HEIGHT - BEND_RADIUS },
                { x: startX + BEND_RADIUS, y: startY + SHAPE_HEIGHT },
                { x: startX + SHAPE_WIDTH - BEND_RADIUS, y: startY + SHAPE_HEIGHT },
                { x: startX + SHAPE_WIDTH, y: startY + SHAPE_HEIGHT - BEND_RADIUS },
                { x: startX + SHAPE_WIDTH, y: startY + BEND_RADIUS },
            ], false);
            // Corner bends
            writer.addArc({ x: startX + BEND_RADIUS, y: startY + BEND_RADIUS }, BEND_RADIUS, 180, 270);
            writer.addArc({ x: startX + BEND_RADIUS, y: startY + SHAPE_HEIGHT - BEND_RADIUS }, BEND_RADIUS, 90, 180);
            writer.addArc({ x: startX + SHAPE_WIDTH - BEND_RADIUS, y: startY + SHAPE_HEIGHT - BEND_RADIUS }, BEND_RADIUS, 0, 90);
            writer.addArc({ x: startX + SHAPE_WIDTH - BEND_RADIUS, y: startY + BEND_RADIUS }, BEND_RADIUS, 270, 360);
            // Hooks
            writer.drawLine(startX + SHAPE_WIDTH, startY + BEND_RADIUS, startX + SHAPE_WIDTH + 10, startY + BEND_RADIUS + 10);
            writer.drawLine(startX, startY + BEND_RADIUS, startX - 10, startY + BEND_RADIUS + 10);
            break;
        case 'tie':
             // Main body with one hook
            writer.addLwpolyline([
                { x: startX + BEND_RADIUS, y: startY },
                { x: startX + SHAPE_WIDTH, y: startY },
                { x: startX + SHAPE_WIDTH, y: startY + SHAPE_HEIGHT },
                { x: startX, y: startY + SHAPE_HEIGHT },
                { x: startX, y: startY + BEND_RADIUS }
            ], false);
             writer.addArc({ x: startX + BEND_RADIUS, y: startY + BEND_RADIUS }, BEND_RADIUS, 180, 270);
            // Hook
            writer.drawLine(startX + BEND_RADIUS, startY, startX, startY - 10);
            break;
        case 'spiral':
            // Represent with interconnected arcs to suggest a spiral
            writer.addArc({ x: startX + 40, y: startY + 10 }, 30, 90, 270);
            writer.addArc({ x: startX + 40, y: startY + 30 }, 30, 270, 90);
            writer.addArc({ x: startX + 40, y: startY + 50 }, 30, 90, 270);
            break;
    }
}

/**
 * Generates and triggers the download of a DXF file for the reinforcement schedule.
 * @param schedule The array of schedule items.
 * @param projectName The name of the project for the file name.
 * @param t The translation function.
 */
export function exportScheduleToDxf(schedule: ScheduleItem[], projectName: string, t: (key: string) => string) {
    const writer = new DxfWriter();

    // Define layers
    writer.addLayer('GEOMETRY', DxfWriter.ACI.WHITE, 'CONTINUOUS');
    writer.addLayer('TEXT', DxfWriter.ACI.CYAN, 'CONTINUOUS');

    // Add a title to the drawing
    writer.setCurrentLayer('TEXT');
    writer.addText({x: 10, y: -20, z: 0}, 20, t('reports.reinforcementSchedule'));
    writer.addText({x: 10, y: -40, z: 0}, 10, projectName);

    // Define layout constants
    const ITEMS_PER_ROW = 3;
    const CELL_WIDTH = 250;
    const CELL_HEIGHT = 150;

    schedule.forEach((item, index) => {
        const row = Math.floor(index / ITEMS_PER_ROW);
        const col = index % ITEMS_PER_ROW;

        const startX = 10 + col * CELL_WIDTH;
        const startY = -100 - row * CELL_HEIGHT;

        // Draw the bar shape
        drawBarShape(writer, item, startX + 20, startY + 40);

        // Add text labels for the item details
        writer.setCurrentLayer('TEXT');
        const textHeight = 8;
        writer.addText({ x: startX, y: startY + 120 }, textHeight, `${t('reports.headers.mark')}: ${item.barMark}`);
        writer.addText({ x: startX, y: startY + 20 }, textHeight, `${t('reports.headers.size')}: ${item.barSize}`);
        writer.addText({ x: startX, y: startY + 10 }, textHeight, `${t('reports.headers.quantity')}: ${item.quantity}`);
        writer.addText({ x: startX, y: startY }, textHeight, `${t('reports.headers.lengthM')}: ${item.length.toFixed(3)}`);
    });

    const dxfString = writer.toString();
    const blob = new Blob([dxfString], { type: 'application/dxf' });
    const href = URL.createObjectURL(blob);
    
    const date = new Date().toISOString().split('T')[0];
    const fileName = `CivilCalc_Schedule_${projectName.replace(/\s/g, '_')}_${date}.dxf`;

    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
}
