import type { ButtonDesignTokens } from '@primeuix/themes/types/button';
import type { ButtonPassThroughOptions, ButtonProps } from 'primevue/button';
import type { RendererElement, RendererNode, VNode } from 'vue';

export const buttonConfig = (): ButtonDesignTokens => {
  return {
    root: {
      paddingX: '2rem',
      paddingY: '1.2rem',
      sm: { paddingX: '.9rem', paddingY: '.9rem' },
      lg: { paddingX: '1.6rem', paddingY: '2rem' },
      label: { fontWeight: 'unset' },
      primary: {
        color: 'var(--black)',
        hoverColor: 'var(--black)',
        activeColor: 'var(--black)',
      },

      secondary: {
        color: 'var(--black)',
        hoverColor: 'var(--black)',
        activeColor: 'var(--black)',
        background: 'var(--secondary-500)',
        hoverBackground: 'var(--secondary-600)',
        activeBackground: 'var(--secondary-700)',
        borderColor: 'transparent',
        hoverBorderColor: 'transparent',
        activeBorderColor: 'transparent',
      },
    },
  };
};

export const buttonPt = (instance?: VNode<RendererNode, RendererElement, ButtonProps>): ButtonPassThroughOptions => {
  if (!instance || !instance.props?.size) {
    return {
      root: {
        class: 'font-14-b',
      },
    };
  }
  return {
    root: {
      class: instance.props.size === 'small' ? 'font-12-r' : 'font-18-b',
    },
  };
};
