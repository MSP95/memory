defmodule Memory.Game do
  def new do
    %{
      squares: create_board(),
      previous: %{id: nil, value: nil},
      currentValues: List.duplicate(nil, 16),
      flag: true,
      score: 0,
      previd: nil,
      isPaused: false,
    }
  end
  def create_board do
    board = ["A", "B", "C","D","E","F","G","H","A", "B",
    "C","D","E","F","G","H"]
    Enum.shuffle(board)
    # board
  end
  def init_view(game) do
    %{
      currentValues: game.currentValues,
      flag: game.flag,
      score: game.score,
      previd: game.previd,
      isPaused: game.isPaused,
    }
  end

  def just_update(game, id, value, flag, score, currentValues, isPaused) do
    previd = game.previous.id
    value = Enum.at(game.squares, id)
    game = put_in(game, [:previous, :id], id)
    game = put_in(game, [:previous, :value], value)
    previous = game.previous

    %{
      squares: game.squares,
      previous: previous,
      currentValues: currentValues,
      flag: flag,
      score: score,
      previd: previd,
      isPaused: isPaused,
    }
  end
  def do_timeout_updates(game, currentValues, previd) do
    thisId = game.previous.value
    if(thisId == Enum.at(game.squares, previd)) do
      replacer = "*"
    else
      replacer = nil
    end
    currentValues1 = List.replace_at(currentValues, game.previous.id, replacer)
    |> List.replace_at(previd, replacer)
    %{
      isPaused: false,
      currentValues: currentValues1,
      squares: game.squares,
      previous: game.previous,
      flag: game.flag,
      score: game.score,
      previd: game.previd,
    }
  end

  def on_tile_click(game, id, flag, score, currentValues, isPaused) do
    value = Enum.at(game.squares, id)
    if isPaused==false do
      pseudo_flag = flag
      previousId = game.previous.id
      previousVal = game.previous.value
      if(Enum.at(currentValues,id)==nil) do
        score = score + 1
        currentValues = List.replace_at(currentValues, id, value)
        pseudo_flag = !flag
        if pseudo_flag == true do
          if previousVal == value do
            just_update(game, id, value, pseudo_flag, score, currentValues, true)
          else
            just_update(game, id, value, pseudo_flag, score, currentValues, true)
          end
        else
          currentValues = List.replace_at(currentValues, id, value)
          just_update(game, id, value, pseudo_flag, score, currentValues, isPaused)
        end
      else
        %{}
      end
    end
  end

end
