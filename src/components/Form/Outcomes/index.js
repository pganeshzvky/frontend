import { useEffect, useState } from 'react';
import { ReactComponent as AddTagIcon } from './add-icon.svg';
import { useValidatedState } from '../hooks/useValidatedState';
import { isValid } from '../utils/validators';
import styles from './styles.module.scss';
import { InputError } from '..';
import { OutcomesValidators } from './validators';
import OutcomeInput from './OutcomeInput';

const Outcomes = ({
  value,
  onChange = () => {},
  setIsValid = () => {},
  max = 4,
  min = 2,
}) => {
  const emptyOutcome = ({ idDiff = '', probability = 0.5 }) => ({
    id: `${Date.now()}${idDiff}`,
    name: '',
    probability,
  });
  const emptyOutcomes = Array(min)
    .fill('')
    .map((_, i) => emptyOutcome({ idDiff: i }));
  const [outcomes, setOutcomes, outcomesErrors] = useValidatedState(
    value || [...emptyOutcomes],
    [OutcomesValidators.duplicateOutcomeName, OutcomesValidators.probabilitySum]
  );
  const [outcomesValidity, setOutcomesValidity] = useState({});

  const outcomesSetter = outcomesToSet => {
    const newOutcomes =
      typeof outcomesToSet === 'function'
        ? outcomesToSet(outcomes)
        : outcomesToSet;
    onChange(newOutcomes);
    setOutcomes(newOutcomes);
  };

  useEffect(() => {
    if (!!value && value.length >= min && value <= max) {
      outcomesSetter(value);
    }
  }, [value]);

  const updateOutcome = updatedOutcome => {
    outcomesSetter(prev =>
      prev.map(outcome =>
        outcome.id === updatedOutcome.id ? updatedOutcome : outcome
      )
    );
  };

  const addOutcome = () => {
    const probability = (1 / (outcomes.length + 1)).toFixed(2);
    outcomesSetter(prevOutcomes => [
      ...prevOutcomes.map(outcome => ({ ...outcome, probability })),
      emptyOutcome({ probability }),
    ]);
  };

  const removeOutcome = removeId => {
    const probability = (1 / (outcomes.length - 1)).toFixed(2);
    outcomesSetter(prevOutcomes =>
      prevOutcomes
        .filter(({ id }) => id !== removeId)
        .map(outcome => ({ ...outcome, probability }))
    );
    setValidity(removeId, true);
  };

  const setValidity = (id, validity) => {
    if (outcomesValidity?.[id] !== validity) {
      setOutcomesValidity(prev => ({ ...prev, [id]: validity }));
    }
  };

  setIsValid(
    Object.keys(outcomesValidity).filter(key => !outcomesValidity[key])
      .length === 0 && isValid(outcomesErrors)
  );

  const showAdd = max < 1 || (max > 0 && outcomes.length < max);
  const showRemove = min > 0 && outcomes.length > min;

  return (
    <div className={styles.outcomes}>
      {outcomes.map((outcome, index) => (
        <div className={styles.outcomeCard}>
          <span className={styles.index}>{index}</span>
          {showRemove && (
            <button
              title="Remove outcome"
              type="button"
              className={styles.removeButton}
              onClick={() => removeOutcome(outcome.id)}
            >
              &times;
            </button>
          )}
          <OutcomeInput
            key={index}
            outcome={outcome}
            onChange={updateOutcome}
            setIsValid={valid => setValidity(outcome.id, valid)}
          />
        </div>
      ))}

      {showAdd && (
        <button className={styles.addButton} onClick={addOutcome} type="button">
          Add outcome
        </button>
      )}

      <InputError
        classes={styles.outcomesErrors}
        errors={outcomesErrors}
        errorMessages={{
          duplicateOutcomeNames: 'All outcomes must have a unique name.',
          incorrectProbabilitiesSum: 'The sum of all probabilities must be 1.',
        }}
      />
    </div>
  );
};

export default Outcomes;
