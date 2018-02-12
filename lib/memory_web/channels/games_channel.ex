defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game

  def join("games:"<> name, payload, socket) do
    if authorized?(payload) do
      game =  Memory.GameBackup.load(name) || Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game"=> Game.init_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("update", payload, socket) do
    %{
      "id"=>id,
      "flag" => flag,
      "score" => score,
      "currentValues" => currentValues,
      "isPaused"=> isPaused
      }=payload
      game = socket.assigns[:game]
      game0 = Game.on_tile_click(game, id, flag, score, currentValues, isPaused)
      Memory.GameBackup.save(socket.assigns[:name], game0)
      socket = assign(socket, :game, game0)
      if game0.isPaused == false do
        {:reply, {:ok, %{"game"=>Game.init_view(game0)}}, socket}
      else
        {:reply, {:dotimeout, %{"game"=>Game.init_view(game0)}}, socket}
      end
    end

    def handle_in("afterto", payload, socket) do
      %{"currentValues" => currentValues, "previd" => previd} = payload
      game = socket.assigns[:game]
      game0 = Game.do_timeout_updates(game, currentValues, previd)
      Memory.GameBackup.save(socket.assigns[:name], game0)
      socket = assign(socket, :game, game0)
      {:reply, {:ok, %{"game"=>Game.init_view(game0)}}, socket}
    end

    def handle_in("reset", _payload, socket) do
      game = Game.new()
      Memory.GameBackup.save(socket.assigns[:name], game)
      socket = assign(socket, :game, game)
      {:reply, {:ok, %{"game"=> Game.init_view(game)}}, socket}
    end

    # Add authorization logic here as required.
    defp authorized?(_payload) do
      true
    end
  end
