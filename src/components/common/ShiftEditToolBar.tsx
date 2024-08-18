import React from 'react';
import ImageButton from '@ui/ImageButton';

type ToolbarProps = {
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const Toolbar: React.FC<ToolbarProps> = ({ onClose, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between">
      {/* 左ぞろえの閉じるボタン */}
      <div className="flex">
        <ImageButton
          onClick={onClose}
          imageSrc="/icons/close.png"
          className=""
        />
      </div>

      {/* 右ぞろえの編集・削除ボタン */}
      <div className="flex space-x-4">
        <ImageButton
          onClick={onEdit}
          imageSrc="/icons/pencil.png"
          className=""
        />
        <ImageButton
 
          onClick={onDelete}
          imageSrc="/icons/trash.png"
          className=""
        />
      </div>
    </div>
  );
};

export default Toolbar;
