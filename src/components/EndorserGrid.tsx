import React from 'react';
import { type Endorser } from '../hooks/useEndorsements';

interface EndorserGridProps {
  endorsements: Endorser[];
}

export const EndorserGrid: React.FC<EndorserGridProps> = ({ endorsements }) => {
  return (
    <div className="efm-max-w-7xl efm-mx-auto efm-px-4 efm-py-12 efm-bg-transparent">
      <div className="efm-grid efm-grid-cols-1 md:efm-grid-cols-2 lg:efm-grid-cols-3 efm-gap-8 efm-bg-transparent">
        {endorsements.map((endorser, index) => (
          <div
            key={index}
            className="efm-bg-white efm-border efm-border-gray-200 efm-p-3 efm-shadow-sm efm-transition-all efm-duration-300 hover:efm-shadow-lg hover:efm-transform hover:efm-translate-y-[-4px] efm-border-l-4 efm-border-l-primary"
          >
            <div className="efm-text-text efm-leading-relaxed">
              <div className="efm-font-manrope efm-font-bold efm-text-xl">{endorser.firstName} {endorser.lastName}</div>
              {(endorser.occupation || endorser.employer) && (
                <div className="efm-font-nunito efm-text-base efm-mt-1 efm-text-gray-600">
                  {endorser.occupation}
                  {endorser.occupation && endorser.employer && ' - '}
                  <span className="efm-italic">{endorser.employer}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
