import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import type { Position } from "@/lib/types"

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
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Réinitialiser les réponses lorsque les positions sélectionnées changent
  useEffect(() => {
    setResponses({})
    onResponsesChange({})
  }, [selectedPositions, onResponsesChange])

  const handleResponseChange = (positionId: string, value: Response) => {
    const newResponses = {
      ...responses,
      [positionId]: value,
    }
    setResponses(newResponses)
    onResponsesChange(newResponses)
    
    // Afficher la confirmation
    setShowConfirmation(true)
    setTimeout(() => setShowConfirmation(false), 3000)
  }

  const allQuestionsAnswered = selectedPositions.every(
    (position) => responses[position.id] !== undefined
  )

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Votre opinion sur ces positions</h2>
      
      {showConfirmation && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            ✅ Réponse enregistrée avec succès
          </AlertDescription>
        </Alert>
      )}

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

      {allQuestionsAnswered && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-600">
            🎯 Toutes les questions ont été répondues. Vous pouvez maintenant consulter vos résultats.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
} 