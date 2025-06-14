
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from 'lucide-react';
import { ChessMove } from '../features/chess/types';
import { moveToNotation } from '../features/chess/utils/notation';

interface MoveHistoryProps {
  moves: ChessMove[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [moves]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5" />
          Move History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full">
          <div className="pr-4" ref={viewportRef}>
            <ol className="space-y-1 text-sm">
              {moves.length === 0 ? (
                <li className="text-muted-foreground">No moves yet.</li>
              ) : (
                moves.map((move, index) => {
                  if (index % 2 !== 0) return null; // Only render for white's move, showing both
                  
                  const moveNumber = Math.floor(index / 2) + 1;
                  const whiteMove = moves[index];
                  const blackMove = moves[index + 1];

                  return (
                    <li key={index} className="grid grid-cols-[auto_1fr_1fr] items-start gap-x-3 py-1 border-b border-border/50">
                      <span className="font-bold text-muted-foreground pt-px">{moveNumber}.</span>
                      <span className="font-mono">{moveToNotation(whiteMove)}</span>
                      {blackMove && <span className="font-mono">{moveToNotation(blackMove)}</span>}
                    </li>
                  );
                })
              )}
            </ol>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MoveHistory;
