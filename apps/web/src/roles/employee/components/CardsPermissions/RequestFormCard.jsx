import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import DatePickerPopover from '../../../../components/DatePickerPopover/DatePickerPopover';
import FormInput from '../../../../components/ui/FormInput';
import FormSelect from '../../../../components/ui/FormSelect';
import { Button } from "../../../../components/Buttons";

export default function RequestFormCard({ permissionOptions, isSubmitting, onSubmit, setShowErrorToast }) {
  const [permissionType, setPermissionType] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!permissionType || !reason || !date) {
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }
    onSubmit({ permissionType, reason, date });

    setPermissionType('');
    setReason('');
    setDate(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-xl font-semibold text-[#194167]"
          style={{ fontFamily: 'Montserrat' }}
        >
          Enviar solicitud
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            id="permissionType"
            label="Tipo de permiso"
            value={permissionType}
            onChange={(e) => setPermissionType(e.target.value)}
            options={permissionOptions}
            icon={FileText}
            className="w-full"
            disabled={isSubmitting}
          />

          <FormInput
            id="reason"
            label="Motivo"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            icon={FileText}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <DatePickerPopover
              id="date"
              label="Fecha"
              value={date}
              onChange={setDate}
              required
              minDate={new Date()}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="btn_second_primary"
              type="submit"
              disabled={isSubmitting}
              className={`${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </div>
              ) : (
                'Enviar solicitud'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}