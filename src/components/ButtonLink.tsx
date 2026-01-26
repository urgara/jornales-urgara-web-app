import { NavLink, type NavLinkProps } from '@mantine/core';
import { createLink, type LinkComponent } from '@tanstack/react-router';
import * as React from 'react';

interface MantineNavLinkProps extends Omit<NavLinkProps, 'href'> {
  children?: React.ReactNode;
  // Add any additional props you want to pass to the NavLink
}

const MantineNavLinkComponent = React.forwardRef<HTMLAnchorElement, MantineNavLinkProps>(
  (props, ref) => {
    return <NavLink ref={ref} {...props} />;
  }
);

const CreatedNavLinkComponent = createLink(MantineNavLinkComponent);

export const ButtonLink: LinkComponent<typeof MantineNavLinkComponent> = (props) => {
  return <CreatedNavLinkComponent preload='intent' {...props} />;
};
