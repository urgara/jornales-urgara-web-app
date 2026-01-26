import { NavLink, type NavLinkProps } from '@mantine/core';
import { useMatches } from '@tanstack/react-router';
import * as React from 'react';

interface NavLinkGroupProps extends Omit<NavLinkProps, 'href'> {
  children: React.ReactNode;
}

export const NavLinkGroup: React.FC<NavLinkGroupProps> = ({ children, ...rest }) => {
  const matches = useMatches();

  // Type guard para validar ReactElement con props
  const isReactElement = (
    child: React.ReactNode
  ): child is React.ReactElement<{ to?: string; children?: React.ReactNode }> => {
    return !!child && typeof child === 'object' && 'props' in child;
  };

  // 🔎 función recursiva para determinar si un hijo está activo
  const checkIfActive = (child: React.ReactNode): boolean => {
    if (!isReactElement(child)) return false;

    // Si es un ButtonLink (tiene prop `to`)
    if (child.props.to) {
      // biome-ignore lint/style/noNonNullAssertion: <lint>
      return matches.some((m) => m.pathname.startsWith(child.props.to!));
    }

    // Si es otro NavLinkGroup, revisamos sus hijos recursivamente
    if (child.type === NavLinkGroup) {
      return React.Children.toArray(child.props.children).some(checkIfActive);
    }

    return false;
  };

  const isChildActive = React.Children.toArray(children).some(checkIfActive);

  return (
    <NavLink active={isChildActive} {...rest}>
      {children}
    </NavLink>
  );
};
