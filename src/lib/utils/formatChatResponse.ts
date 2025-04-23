interface RawChatResponse {
  content: string;
}

interface Point {
  candidate?: string;
  content: string;
}

interface FormattedResponse {
  introduction: {
    title: string;
    content: string;
  };
  analysis: {
    title: string;
    points: Point[];
  };
  conclusion: {
    title: string;
    content: string;
  };
}

export function formatChatResponse(rawResponse: RawChatResponse): FormattedResponse {
  console.log('Formatting response:', rawResponse);

  // Vérification de la réponse
  if (!rawResponse || typeof rawResponse.content !== 'string') {
    console.error('Invalid response format:', rawResponse);
    return {
      introduction: {
        title: "Erreur",
        content: "Format de réponse invalide"
      },
      analysis: {
        title: "Erreur",
        points: [{ content: "La réponse n'est pas dans le bon format" }]
      },
      conclusion: {
        title: "Erreur",
        content: "Veuillez réessayer"
      }
    };
  }

  // Nettoyer le texte
  const cleanText = rawResponse.content
    .replace(/\r\n/g, '\n')
    .replace(/\n\n+/g, '\n\n')
    .trim();

  console.log('Cleaned text:', cleanText);

  // Diviser en sections principales
  const sections = cleanText.split(/\n(?=\d\.\s+)/).filter(Boolean);
  console.log('Sections found:', sections.length);
  console.log('Sections:', sections);

  // Formater une section
  const formatSection = (text: string, defaultTitle: string) => {
    const lines = text.split('\n').filter(Boolean);
    const title = lines[0]
      .replace(/^\d\.\s*/, '')
      .replace(/^(Introduction|Analyse|Conclusion)[:\s]*/i, '')
      .trim();
    const content = lines.slice(1).join('\n').trim();

    console.log(`Formatting section "${defaultTitle}":`, { title, content });

    return {
      title: title || defaultTitle,
      content: content || `Aucun contenu disponible pour ${defaultTitle.toLowerCase()}`
    };
  };

  // Formater l'analyse
  const formatAnalysis = (text: string) => {
    const lines = text.split('\n').filter(Boolean);
    const title = lines[0]
      .replace(/^\d\.\s*/, '')
      .replace(/^Analyse[:\s]*/i, '')
      .trim();

    const points: Point[] = [];
    let currentPoint: Point = { content: '' };

    console.log('Formatting analysis section, lines:', lines);

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.match(/^[-•]\s/)) {
        if (currentPoint.content) {
          points.push({ ...currentPoint });
        }
        currentPoint = {
          content: line.replace(/^[-•]\s/, '')
        };
      } else if (line.match(/^[A-Z][a-zÀ-ÿ\s]+:/)) {
        if (currentPoint.content) {
          points.push({ ...currentPoint });
        }
        const [candidate, ...content] = line.split(':');
        currentPoint = {
          candidate: candidate.trim(),
          content: content.join(':').trim()
        };
      } else {
        currentPoint.content += (currentPoint.content ? '\n' : '') + line;
      }
    }

    if (currentPoint.content) {
      points.push({ ...currentPoint });
    }

    if (points.length === 0) {
      points.push({
        content: lines.slice(1).join('\n').trim() || "Aucun point d'analyse disponible"
      });
    }

    console.log('Formatted analysis points:', points);

    return {
      title: title || "Analyse",
      points
    };
  };

  // Construire la réponse formatée
  const formattedResponse = {
    introduction: formatSection(sections[0] || '', 'Introduction'),
    analysis: formatAnalysis(sections[1] || '2. Analyse'),
    conclusion: formatSection(sections[2] || '', 'Conclusion')
  };

  console.log('Final formatted response:', formattedResponse);
  return formattedResponse;
} 