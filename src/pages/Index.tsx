import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

interface Well {
  id: number;
  x: number;
  y: number;
  row: number;
  col: number;
  delay: number;
  exploded: boolean;
}

export default function Index() {
  const [depth, setDepth] = useState(12);
  const [wellSpacing, setWellSpacing] = useState(5);
  const [rowSpacing, setRowSpacing] = useState(6);
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(5);
  const [delay, setDelay] = useState(25);
  const [isExploding, setIsExploding] = useState(false);
  const [wells, setWells] = useState<Well[]>([]);
  const [currentDelay, setCurrentDelay] = useState(0);

  useEffect(() => {
    generateWells();
  }, [rows, cols, wellSpacing, rowSpacing]);

  const generateWells = () => {
    const newWells: Well[] = [];
    let id = 0;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const wellDelay = (row * cols + col) * delay;
        newWells.push({
          id: id++,
          x: col * wellSpacing,
          y: row * rowSpacing,
          row,
          col,
          delay: wellDelay,
          exploded: false,
        });
      }
    }
    
    setWells(newWells);
  };

  const startBlast = () => {
    setIsExploding(true);
    setCurrentDelay(0);
    
    const resetWells = wells.map(w => ({ ...w, exploded: false }));
    setWells(resetWells);

    const maxDelay = Math.max(...wells.map(w => w.delay));
    const interval = 50;
    
    const timer = setInterval(() => {
      setCurrentDelay(prev => {
        const nextDelay = prev + interval;
        
        setWells(currentWells => 
          currentWells.map(well => 
            well.delay <= nextDelay && !well.exploded
              ? { ...well, exploded: true }
              : well
          )
        );
        
        if (nextDelay >= maxDelay + 1000) {
          clearInterval(timer);
          setIsExploding(false);
          return 0;
        }
        
        return nextDelay;
      });
    }, interval);
  };

  const resetBlast = () => {
    setIsExploding(false);
    setCurrentDelay(0);
    setWells(wells.map(w => ({ ...w, exploded: false })));
  };

  const totalWells = rows * cols;
  const totalExplosiveWeight = (depth * 0.8 * totalWells).toFixed(1);
  const totalTime = ((totalWells - 1) * delay / 1000).toFixed(2);

  const gridWidth = (cols - 1) * wellSpacing;
  const gridHeight = (rows - 1) * rowSpacing;
  const scale = Math.min(400 / gridWidth, 400 / gridHeight, 15);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
            <Icon name="Bomb" size={40} className="text-accent" />
            Симуляция промышленного взрыва
          </h1>
          <p className="text-muted-foreground">Расчет и визуализация взрывных работ с замедлениями</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="Settings" size={24} className="text-primary" />
                Параметры скважин
              </h2>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-foreground mb-2 block">
                    Глубина скважин: {depth} м
                  </Label>
                  <Slider
                    value={[depth]}
                    onValueChange={(v) => setDepth(v[0])}
                    min={5}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground mb-2 block">
                      Расстояние между скважинами (м)
                    </Label>
                    <Input
                      type="number"
                      value={wellSpacing}
                      onChange={(e) => setWellSpacing(Number(e.target.value))}
                      min={2}
                      max={10}
                      className="bg-input border-border"
                    />
                  </div>

                  <div>
                    <Label className="text-foreground mb-2 block">
                      Расстояние между рядами (м)
                    </Label>
                    <Input
                      type="number"
                      value={rowSpacing}
                      onChange={(e) => setRowSpacing(Number(e.target.value))}
                      min={2}
                      max={10}
                      className="bg-input border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground mb-2 block">
                      Количество рядов
                    </Label>
                    <Input
                      type="number"
                      value={rows}
                      onChange={(e) => setRows(Math.max(1, Math.min(10, Number(e.target.value))))}
                      min={1}
                      max={10}
                      className="bg-input border-border"
                    />
                  </div>

                  <div>
                    <Label className="text-foreground mb-2 block">
                      Скважин в ряду
                    </Label>
                    <Input
                      type="number"
                      value={cols}
                      onChange={(e) => setCols(Math.max(1, Math.min(10, Number(e.target.value))))}
                      min={1}
                      max={10}
                      className="bg-input border-border"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-foreground mb-2 block">
                    Замедление между скважинами: {delay} мс
                  </Label>
                  <Slider
                    value={[delay]}
                    onValueChange={(v) => setDelay(v[0])}
                    min={10}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="Calculator" size={24} className="text-secondary" />
                Расчетные данные
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Всего скважин:</span>
                  <span className="font-mono text-xl font-bold text-foreground">{totalWells}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Общий расход ВВ:</span>
                  <span className="font-mono text-xl font-bold text-accent">{totalExplosiveWeight} кг</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Длительность взрыва:</span>
                  <span className="font-mono text-xl font-bold text-secondary">{totalTime} сек</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Площадь покрытия:</span>
                  <span className="font-mono text-xl font-bold text-primary">
                    {((rows - 1) * rowSpacing * (cols - 1) * wellSpacing).toFixed(0)} м²
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button 
                  onClick={startBlast} 
                  disabled={isExploding}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Icon name="Zap" size={20} className="mr-2" />
                  Начать взрыв
                </Button>
                <Button 
                  onClick={resetBlast}
                  variant="outline"
                  className="border-border"
                >
                  <Icon name="RotateCcw" size={20} />
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="Grid3x3" size={24} className="text-secondary" />
                Схема расположения скважин
              </h2>
              
              <div 
                className="relative bg-muted/30 rounded-lg border border-border"
                style={{ 
                  width: '100%', 
                  paddingBottom: '100%',
                  overflow: 'hidden'
                }}
              >
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox={`${-wellSpacing} ${-rowSpacing} ${gridWidth + wellSpacing * 2} ${gridHeight + rowSpacing * 2}`}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <radialGradient id="explosionGradient">
                      <stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#F97316" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {wells.map((well) => {
                    const exploding = well.exploded && isExploding;
                    const willExplode = well.delay <= currentDelay + 200 && well.delay > currentDelay - 200;
                    
                    return (
                      <g key={well.id}>
                        {exploding && (
                          <>
                            <circle
                              cx={well.x}
                              cy={well.y}
                              r={wellSpacing * 1.5}
                              fill="url(#explosionGradient)"
                              className="animate-ping"
                              style={{ animationDuration: '0.8s' }}
                            />
                            <circle
                              cx={well.x}
                              cy={well.y}
                              r={wellSpacing * 0.8}
                              fill="#F97316"
                              opacity="0.6"
                            />
                          </>
                        )}
                        
                        <circle
                          cx={well.x}
                          cy={well.y}
                          r={wellSpacing * 0.25}
                          fill={exploding ? '#F97316' : willExplode ? '#0EA5E9' : '#6366f1'}
                          stroke={exploding ? '#FFF' : '#0EA5E9'}
                          strokeWidth={0.2}
                          className={willExplode && !exploding ? 'animate-pulse' : ''}
                        />
                        
                        <text
                          x={well.x}
                          y={well.y - wellSpacing * 0.4}
                          textAnchor="middle"
                          fontSize={wellSpacing * 0.3}
                          fill="#94a3b8"
                          fontFamily="monospace"
                        >
                          {well.delay}мс
                        </text>
                      </g>
                    );
                  })}

                  {wells.map((well) => {
                    const nextWell = wells.find(
                      w => w.row === well.row && w.col === well.col + 1
                    );
                    if (nextWell) {
                      return (
                        <line
                          key={`h-${well.id}`}
                          x1={well.x}
                          y1={well.y}
                          x2={nextWell.x}
                          y2={nextWell.y}
                          stroke="#334155"
                          strokeWidth={0.1}
                          strokeDasharray="0.3,0.3"
                        />
                      );
                    }
                    return null;
                  })}

                  {wells.map((well) => {
                    const nextWell = wells.find(
                      w => w.row === well.row + 1 && w.col === well.col
                    );
                    if (nextWell) {
                      return (
                        <line
                          key={`v-${well.id}`}
                          x1={well.x}
                          y1={well.y}
                          x2={nextWell.x}
                          y2={nextWell.y}
                          stroke="#334155"
                          strokeWidth={0.1}
                          strokeDasharray="0.3,0.3"
                        />
                      );
                    }
                    return null;
                  })}
                </svg>
              </div>

              {isExploding && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Прогресс взрыва</span>
                    <span>{((currentDelay / (Math.max(...wells.map(w => w.delay)) + 1000)) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-accent h-full transition-all duration-100"
                      style={{ 
                        width: `${Math.min(100, (currentDelay / (Math.max(...wells.map(w => w.delay)) + 1000)) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="Info" size={24} className="text-primary" />
                Легенда
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#6366f1] border-2 border-secondary" />
                  <span className="text-muted-foreground">Скважина в ожидании</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary animate-pulse" />
                  <span className="text-muted-foreground">Подготовка к взрыву</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent" />
                  <span className="text-muted-foreground">Детонация</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
