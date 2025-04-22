import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Position } from "@/lib/positions"

type Response = "agree" | "disagree" | "neutral"

export interface UserResponses {
  [positionId: string]: Response
}

interface ResponseFormProps {
  selectedPositions: Position[]
  onResponsesChange: (responses: UserResponses) => void
}

export function ResponseForm({ selectedPositions, onResponsesChange }: ResponseFormProps) {
  const [responses, setResponses] = useState<UserResponses>({})

  const handleResponseChange = (positionId: string, value: Response) => {
    const newResponses = {
      ...responses,
      [positionId]: value,
    }
    setResponses(newResponses)
    onResponsesChange(newResponses)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Votre opinion sur ces positions</h2>
      
      {selectedPositions.map((position) => (
        <Card key={position.id}>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              {position.content}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={responses[position.id]}
              onValueChange={(value) => handleResponseChange(position.id, value as Response)}
              className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="agree" id={`agree-${position.id}`} />
                <Label htmlFor={`agree-${position.id}`}>✅ D'accord</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="disagree" id={`disagree-${position.id}`} />
                <Label htmlFor={`disagree-${position.id}`}>❌ Pas d'accord</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutral" id={`neutral-${position.id}`} />
                <Label htmlFor={`neutral-${position.id}`}>⚪ Neutre</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 