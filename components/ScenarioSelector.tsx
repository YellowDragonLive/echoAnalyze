import React from 'react';
import { SCENARIOS } from '../constants';
import { Scenario } from '../types';

interface ScenarioSelectorProps {
  selectedScenario: Scenario;
  onSelect: (scenario: Scenario) => void;
  disabled: boolean;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ selectedScenario, onSelect, disabled }) => {
  return (
    <div className="mb-8">
      <h2 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-4">1. 选择分析场景</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario)}
            disabled={disabled}
            className={`
              relative p-3 rounded-xl border text-left transition-all duration-200
              flex flex-col gap-2 h-full
              ${selectedScenario.id === scenario.id
                ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-750'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="text-2xl">{scenario.icon}</div>
            <div>
              <div className={`font-semibold text-sm ${selectedScenario.id === scenario.id ? 'text-white' : 'text-slate-200'}`}>
                {scenario.name}
              </div>
            </div>
            {selectedScenario.id === scenario.id && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
            )}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">{selectedScenario.description}</p>
    </div>
  );
};

export default ScenarioSelector;