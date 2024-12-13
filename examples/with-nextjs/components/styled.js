import tw, { styled } from 'twin.macro';

export const TranscriberWrapper = styled.div`
  ${tw`flex flex-col gap-4 p-8 w-2/5`};

  .recorder {
    ${tw`flex justify-between items-center gap-2 bg-green-200 p-4 rounded shadow`};

    button {
      &.record {
        ${tw`bg-green-600 font-bold text-white shadow py-2 px-6 rounded border-none outline-none`};

        &.paused {
          ${tw`bg-yellow-500`};
        }
      }
      
      &.stop {
        ${tw`bg-red-400 font-bold text-white shadow py-2 px-6 rounded border-none outline-none`};
      }
    }

    .indicator {
      ${tw`animate-pulse w-4 h-4 bg-red-400 shadow rounded-full`};
    }

    .timer {
      ${tw`flex items-center font-bold bg-gray-200 rounded px-2 py-2`};
    }
  }
`;