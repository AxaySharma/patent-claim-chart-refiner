import { useState, useCallback } from 'react';
import type { ClaimElement, ChatMessage, ClaimChart, SuggestedChange } from '../types';

export function useRefinement(initialChart: ClaimChart, initialMessages: ChatMessage[]) {
  const [chart, setChart] = useState<ClaimChart>(initialChart);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [activeElementId, setActiveElementId] = useState<string | null>(
    initialChart.elements[0]?.id || null
  );
  const [historyStack, setHistoryStack] = useState<{
    elementId: string;
    previousState: ClaimElement;
    changeDescription: string;
  }[]>([]);
  const [flashElementId, setFlashElementId] = useState<string | null>(null);

  const activeElement = chart.elements.find((e) => e.id === activeElementId) || null;

  // Infer target element from text if not active
  const inferTargetElement = (text: string): ClaimElement | null => {
    const lower = text.toLowerCase();

    if (lower.includes('element 1') || lower.includes('wireless') || lower.includes('wifi') || lower.includes('lan')) {
      return chart.elements.find((e) => e.id === 'elem-1') || activeElement;
    }
    if (lower.includes('element 2') || lower.includes('motion') || lower.includes('pir') || lower.includes('sensor')) {
      return chart.elements.find((e) => e.id === 'elem-2') || activeElement;
    }
    if (lower.includes('element 3') || lower.includes('ml') || lower.includes('algorithm') || lower.includes('neural') || lower.includes('learning')) {
      return chart.elements.find((e) => e.id === 'elem-3') || activeElement;
    }
    return activeElement;
  };

  const updateElementDirectly = (updatedElement: ClaimElement) => {
    const currentEl = chart.elements.find((e) => e.id === updatedElement.id);
    if (currentEl) {
      setHistoryStack((prev) => [
        ...prev,
        {
          elementId: updatedElement.id,
          previousState: { ...currentEl },
          changeDescription: 'Manual row edit',
        },
      ]);
    }

    setChart((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === updatedElement.id ? updatedElement : el)),
    }));
  };

  const handleSendMessage = useCallback((text: string) => {
    const targetEl = inferTargetElement(text);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      relatedClaimElementId: targetEl?.id,
    };

    setMessages((prev) => [...prev, userMsg]);

    const lowerText = text.toLowerCase();

    setTimeout(() => {
      // 1. Check for Revert / Undo
      if (lowerText.includes('undo') || lowerText.includes('revert')) {
        if (historyStack.length === 0) {
          const aiMsg: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            role: 'ai',
            content: 'There are no previous changes in the undo stack to revert.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, aiMsg]);
          return;
        }

        const lastItem = historyStack[historyStack.length - 1];
        setHistoryStack((prev) => prev.slice(0, -1));

        setChart((prev) => ({
          ...prev,
          elements: prev.elements.map((el) =>
            el.id === lastItem.elementId ? { ...lastItem.previousState } : el
          ),
        }));

        setFlashElementId(lastItem.elementId);
        setTimeout(() => setFlashElementId(null), 1200);

        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'ai',
          content: `Reverted last change (${lastItem.changeDescription}) for element #${lastItem.elementId.replace('elem-', '')}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          relatedClaimElementId: lastItem.elementId,
        };
        setMessages((prev) => [...prev, aiMsg]);
        return;
      }

      // 2. Check for missing feature edge-case (e.g. "temperature sensor", "ambient light")
      if (lowerText.includes('temperature sensor') || lowerText.includes('humidity') || lowerText.includes('light sensor')) {
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'ai',
          content: `I could not find definitive evidence for the claimed feature in the currently attached documentation. Please upload additional product datasheets or paste a URL for this feature.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          requiresUploadDoc: true,
        };
        setMessages((prev) => [...prev, aiMsg]);
        return;
      }

      // 3. Check for "strengthen evidence"
      if (lowerText.includes('strengthen') || lowerText.includes('evidence') || lowerText.includes('more proof')) {
        if (!targetEl) return;
        const proposedEvidence = `${targetEl.evidenceSource} [Added per analyst request: Confirmed via internal test log #4029]`;
        const suggestedChange: SuggestedChange = {
          field: 'evidenceSource',
          newValue: proposedEvidence,
          status: 'pending',
        };

        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'ai',
          content: `I recommend strengthening the evidence citation for Element #${targetEl.id.replace('elem-', '')} by referencing test log #4029:\n\n"${proposedEvidence}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          relatedClaimElementId: targetEl.id,
          suggestedChange,
        };
        setMessages((prev) => [...prev, aiMsg]);
        return;
      }

      // 4. Check for "weak" or "vague" AI reasoning
      if (lowerText.includes('weak') || lowerText.includes('vague') || lowerText.includes('explain better') || lowerText.includes('detail')) {
        if (!targetEl) return;
        const proposedReasoning = `[Enhanced Technical Analysis] ${targetEl.aiReasoning} Specifically, the architectural design explicitly satisfies all claim boundaries by demonstrating functional equivalence without material variance.`;
        const suggestedChange: SuggestedChange = {
          field: 'aiReasoning',
          newValue: proposedReasoning,
          status: 'pending',
        };

        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'ai',
          content: `Here is a more thorough, detailed reasoning rewrite for Element #${targetEl.id.replace('elem-', '')}:\n\n"${proposedReasoning}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          relatedClaimElementId: targetEl.id,
          suggestedChange,
        };
        setMessages((prev) => [...prev, aiMsg]);
        return;
      }

      // 5. Default General Response
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'ai',
        content: `Understood. I've logged your input regarding ${
          targetEl ? `Element #${targetEl.id.replace('elem-', '')}` : 'the claim chart'
        }. You can ask me to "strengthen evidence", mark reasoning as "weak", or "undo" changes at any time.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relatedClaimElementId: targetEl?.id,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 700);
  }, [activeElement, chart.elements, historyStack]);

  const handleAcceptSuggestion = (messageId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg || !msg.suggestedChange || !msg.relatedClaimElementId) return;

    const elId = msg.relatedClaimElementId;
    const currentEl = chart.elements.find((e) => e.id === elId);
    if (!currentEl) return;

    // Push to history for undo
    setHistoryStack((prev) => [
      ...prev,
      {
        elementId: elId,
        previousState: { ...currentEl },
        changeDescription: `Updated ${msg.suggestedChange!.field}`,
      },
    ]);

    // Update element
    const updatedEl: ClaimElement = {
      ...currentEl,
      [msg.suggestedChange.field]: msg.suggestedChange.newValue,
      status: 'accepted',
    };

    setChart((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === elId ? updatedEl : el)),
    }));

    // Update message status
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, suggestedChange: { ...m.suggestedChange!, status: 'accepted' } }
          : m
      )
    );

    // Trigger green flash effect
    setFlashElementId(elId);
    setTimeout(() => setFlashElementId(null), 1200);
  };

  const handleRejectSuggestion = (messageId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg || !msg.suggestedChange) return;

    // Mark suggestion as rejected
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, suggestedChange: { ...m.suggestedChange!, status: 'rejected' } }
          : m
      )
    );

    // Prompt analyst in chat
    setTimeout(() => {
      const followUpMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'ai',
        content: `Suggestion rejected. Could you please specify why this proposal was unsuitable so I can refine further?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relatedClaimElementId: msg.relatedClaimElementId,
      };
      setMessages((prev) => [...prev, followUpMsg]);
    }, 400);
  };

  return {
    chart,
    messages,
    activeElementId,
    activeElement,
    flashElementId,
    setActiveElementId,
    handleSendMessage,
    handleAcceptSuggestion,
    handleRejectSuggestion,
    updateElementDirectly,
  };
}
