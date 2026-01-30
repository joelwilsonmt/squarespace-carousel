import React from 'react';
import { Carousel } from './components/Carousel';
import { EndorserGrid } from './components/EndorserGrid';
import { useEndorsements } from './hooks/useEndorsements';

const App: React.FC = () => {
  const { endorsements, loading, error } = useEndorsements();

  if (loading) {
    return (
      <div className="efm-flex efm-items-center efm-justify-center efm-h-64">
        <div className="efm-animate-spin efm-rounded-full efm-h-12 efm-w-12 efm-border-t-2 efm-border-b-2 efm-border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="efm-text-center efm-p-8 efm-text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="efm-text-text efm-font-sans">
      <Carousel />
      <section className="efm-py-12">
        <div className="efm-max-w-7xl efm-mx-auto efm-px-4">
          <h2 className="efm-text-3xl efm-font-bold efm-text-primary efm-mb-8 efm-text-center">
            Our Endorsers
          </h2>
          <EndorserGrid endorsements={endorsements} />
        </div>
      </section>
    </div>
  );
};

export default App;
