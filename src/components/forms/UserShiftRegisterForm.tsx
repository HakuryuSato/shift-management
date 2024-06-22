// モーダルウィンドウとして表示される
import TimeInput from '@ui/TimeInput'
import React from 'react';
import Button from '@ui/Button'

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
};



const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title }) => {

  // 背景クリック時に閉じる処理
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleButtonClick=()=>{
    
  }



  if (!isOpen) return null;

  return (
    // ↓モーダル用の黒塗り背景
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleOverlayClick}>

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
        </div>

        <div className="p-4">

          <h3 className="mb-4 flex justify-center ">シフトを希望する時間を入力してください</h3>
          <div className="flex justify-center items-center space-x-2">
            <TimeInput initialValue="08:30" />
            <a className="pt-3">-</a>
            <TimeInput initialValue="18:00" />
          </div>

          <div className="pt-10 flex justify-center ">


            <Button
              text='登録'
              onClick={handleButtonClick}
            />


          </div>

        </div>


      </div>
    </div>
  );
};

export default Modal;
