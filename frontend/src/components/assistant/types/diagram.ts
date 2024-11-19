interface DiagramGenerationParams {
  description: string;
  type: 'mechanical' | 'electrical' | 'system' | 'component';
  year?: string;
  make?: string;
  model?: string;
} 