<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Configuration;

class ConfigurationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['publicIndex', 'publicShow']);
    }

    public function index()
    {
        $user = request()->user();

        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        $configurations = Configuration::orderBy('group_name')->orderBy('label')->get();

        return response()->json([
            'success' => true,
            'data' => $configurations
        ]);
    }

    public function publicIndex()
    {
        $configurations = Configuration::pluck('value', 'key_name');

        return response()->json([
            'success' => true,
            'data' => $configurations
        ]);
    }

    public function publicShow($key)
    {
        $configuration = Configuration::where('key_name', $key)->first();

        if (!$configuration) {
            return response()->json([
                'success' => false,
                'message' => 'Configuration not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'key_name' => $configuration->key_name,
                'value' => $configuration->value,
                'type' => $configuration->type,
            ]
        ]);
    }

    public function update(Request $request, $key)
    {
        $user = request()->user();

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        $configuration = Configuration::where('key_name', $key)->first();

        if (!$configuration) {
            return response()->json([
                'success' => false,
                'message' => 'Configuration not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'value' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $configuration->update([
            'value' => $request->value,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Configuration updated successfully',
            'data' => $configuration
        ]);
    }

    public function bulkUpdate(Request $request)
    {
        $user = request()->user();

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'configurations' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            foreach ($request->configurations as $key => $value) {
                Configuration::where('key_name', $key)->update(['value' => $value]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Configurations updated successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update configurations: ' . $e->getMessage()
            ], 500);
        }
    }
}

